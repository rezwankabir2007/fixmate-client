import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/lib/auth";
import { auth } from "@/lib/auth";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

function isUserRole(role: string): role is UserRole {
  return role === "customer" || role === "technician" || role === "admin";
}

function dashboardPath(role: UserRole) {
  return `/dashboard/${role}`;
}

export async function getDashboardUserFromHeaders(requestHeaders: Headers): Promise<DashboardUser | null> {
  const session = await auth.api.getSession({
    headers: requestHeaders,
    query: { disableCookieCache: true },
  });

  if (!session || !isUserRole(session.user.role)) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
}

export async function requireDashboardUser(role?: UserRole): Promise<DashboardUser> {
  const user = await getDashboardUserFromHeaders(await headers());

  if (!user) redirect("/sign-in");
  if (role && user.role !== role) redirect(dashboardPath(user.role));

  return user;
}

export async function requireDashboardApiUser(request: Request, role: UserRole) {
  const user = await getDashboardUserFromHeaders(request.headers);
  if (!user) return { user: null, status: 401 as const };
  if (user.role !== role) return { user: null, status: 403 as const };
  return { user, status: 200 as const };
}

export function isSameOriginRequest(request: Request) {
  const originHeader = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!originHeader || !host) return false;

  try {
    const origin = new URL(originHeader);
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProtocol || new URL(request.url).protocol.slice(0, -1);
    return origin.host === host && origin.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}
