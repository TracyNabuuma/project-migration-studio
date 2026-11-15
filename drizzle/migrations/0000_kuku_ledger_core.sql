create type public.app_role as enum ('owner', 'manager');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text not null default '',
  legacy_user_id uuid unique,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_team_member(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id)
$$;

create policy "own profile or owner reads" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'owner'));
create policy "update own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "read own roles or owner reads all" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'owner'));

-- Profile + first-user-is-owner on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  if not exists (select 1 from public.user_roles) then
    insert into public.user_roles (user_id, role) values (new.id, 'owner');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Generic sync store (one row per client record)
create table public.record_store (
  table_name text not null,
  record_id text not null,
  data jsonb not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  server_updated_at timestamptz not null default now(),
  primary key (table_name, record_id)
);
create index record_store_server_updated_idx on public.record_store (server_updated_at);
grant select, insert, update on public.record_store to authenticated;
grant all on public.record_store to service_role;
alter table public.record_store enable row level security;

create or replace function public.is_owner_only_table(_t text)
returns boolean language sql immutable as $$ select _t in ('auditLog', 'pushSubscriptions') $$;

create policy "team reads records" on public.record_store for select to authenticated
  using (public.is_team_member(auth.uid()) and (not public.is_owner_only_table(table_name) or public.has_role(auth.uid(), 'owner')));
create policy "team inserts records" on public.record_store for insert to authenticated
  with check (public.is_team_member(auth.uid()) and (not public.is_owner_only_table(table_name) or public.has_role(auth.uid(), 'owner')));
create policy "team updates records" on public.record_store for update to authenticated
  using (public.is_team_member(auth.uid()) and (not public.is_owner_only_table(table_name) or public.has_role(auth.uid(), 'owner')))
  with check (public.is_team_member(auth.uid()) and (not public.is_owner_only_table(table_name) or public.has_role(auth.uid(), 'owner')));

create or replace function public.touch_server_updated_at()
returns trigger language plpgsql as $$
begin new.server_updated_at := clock_timestamp(); return new; end $$;
create trigger record_store_touch before insert or update on public.record_store
  for each row execute function public.touch_server_updated_at();

create table public.sync_log (
  id bigserial primary key,
  table_name text not null,
  record_id text not null,
  action text not null,
  user_id uuid,
  created_at timestamptz not null default now()
);
grant select, insert on public.sync_log to authenticated;
grant usage on sequence public.sync_log_id_seq to authenticated;
grant all on public.sync_log to service_role;
alter table public.sync_log enable row level security;
create policy "team writes own log" on public.sync_log for insert to authenticated
  with check (user_id = auth.uid() and public.is_team_member(auth.uid()));
create policy "owner reads log" on public.sync_log for select to authenticated
  using (public.has_role(auth.uid(), 'owner'));

-- Push: newest updated_at wins; runs as caller so RLS applies.
create or replace function public.sync_push(_changes jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare
  ch jsonb; r jsonb; applied int := 0; rejected jsonb := '[]'::jsonb; n int;
begin
  if not public.is_team_member(auth.uid()) then
    raise exception 'Not a team member';
  end if;
  for ch in select * from jsonb_array_elements(_changes) loop
    if public.is_owner_only_table(ch->>'table') and not public.has_role(auth.uid(), 'owner') then
      rejected := rejected || jsonb_build_object('table', ch->>'table', 'id', '*', 'reason', 'owner-only table');
      continue;
    end if;
    for r in select * from jsonb_array_elements(ch->'rows') loop
      insert into public.record_store (table_name, record_id, data, updated_at, deleted_at)
      values (ch->>'table', r->>'id', r, (r->>'updatedAt')::timestamptz, nullif(r->>'deletedAt', '')::timestamptz)
      on conflict (table_name, record_id) do update
        set data = excluded.data, updated_at = excluded.updated_at, deleted_at = excluded.deleted_at
        where record_store.updated_at <= excluded.updated_at;
      get diagnostics n = row_count;
      if n > 0 then
        applied := applied + 1;
        insert into public.sync_log (table_name, record_id, action, user_id) values (ch->>'table', r->>'id', 'push', auth.uid());
      end if;
    end loop;
  end loop;
  return jsonb_build_object('applied', applied, 'rejected', rejected);
end $$;
grant execute on function public.sync_push(jsonb) to authenticated;