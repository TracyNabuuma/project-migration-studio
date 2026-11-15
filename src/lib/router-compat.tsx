/** Thin adapters so the ported screens keep their link/navigation calls on TanStack Router. */
import {
  Link as TsLink,
  Navigate as TsNavigate,
  useLocation as useTsLocation,
  useNavigate as useTsNavigate,
  useParams as useTsParams,
  useRouter,
} from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: string; children?: ReactNode };

export function Link({ to, ...rest }: LinkProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TsLink to={to as any} {...rest} />;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean; state?: unknown }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TsNavigate to={to as any} replace={replace} />;
}

export function useNavigate() {
  const navigate = useTsNavigate();
  const router = useRouter();
  return (to: string | number) => {
    if (typeof to === "number") return router.history.go(to);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return navigate({ to: to as any });
  };
}

export function useLocation() {
  return useTsLocation();
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useTsParams({ strict: false } as never) as T;
}
