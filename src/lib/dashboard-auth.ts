import { headers } from "next/headers";
// Next.js-কে স্পষ্টভাবে জানানোর জন্য যে এই ফাংশনটি রিকোয়েস্ট-টাইমে ডাইনামিকভাবে চলবে
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { dashboardPathForRole, isUserRole, type UserRole } from "@/lib/user-role";

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export async function getDashboardUserFromHeaders(
  requestHeaders: Headers,
): Promise<DashboardUser | null> {
  // ইনকামিং রিকোয়েস্ট থেকে কুকি নেওয়া হচ্ছে
  const cookie = requestHeaders.get("cookie");
  if (!cookie) return null;

  const backendOrigin = process.env.FIXMATE_API_URL;
  if (!backendOrigin) {
    throw new Error("FIXMATE_API_URL is required to verify dashboard sessions.");
  }

  // ব্যাকএন্ড থেকে সেশন যাচাই করার URL তৈরি করা হচ্ছে
  const sessionUrl = new URL("/api/auth/get-session", backendOrigin);
  sessionUrl.searchParams.set("disableCookieCache", "true");

  const response = await fetch(sessionUrl, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Better Auth session lookup failed with status ${response.status}.`,
    );
  }

  const session: unknown = await response.json();
  if (session === null) return null;

  if (
    typeof session !== "object" ||
    !("user" in session) ||
    typeof session.user !== "object" ||
    session.user === null
  ) {
    throw new Error("Better Auth returned an invalid session response.");
  }

  const user = session.user;
  if (
    !("id" in user) ||
    typeof user.id !== "string" ||
    !("name" in user) ||
    typeof user.name !== "string" ||
    !("email" in user) ||
    typeof user.email !== "string" ||
    !("role" in user) ||
    !isUserRole(user.role)
  ) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function requireDashboardUser(
  role?: UserRole,
): Promise<DashboardUser> {
  // prerender/build-time বা uncached data ওয়ার্নিং এড়াতে রিকোয়েস্ট কানেকশনের জন্য অপেক্ষা করা হচ্ছে
  await connection();

  const user = await getDashboardUserFromHeaders(await headers());

  if (!user) redirect("/sign-in");
  if (role && user.role !== role) redirect(dashboardPathForRole(user.role));

  return user;
}