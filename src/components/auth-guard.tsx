"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export type AllowedRole = "customer" | "technician" | "admin";

function resolveRolePath(role: string | undefined) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "technician") return "/dashboard/technician";
  return "/dashboard/customer";
}

export function RoleGuard({
  allowedRole,
  children,
}: {
  allowedRole: AllowedRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  React.useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    const userRole = (session.user as { role?: string } | undefined)?.role ?? "customer";

    if (userRole !== allowedRole) {
      router.replace(resolveRolePath(userRole));
    }
  }, [allowedRole, isPending, router, session]);

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Loading your workspace…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Redirecting to sign in…
      </div>
    );
  }

  const userRole = (session.user as { role?: string } | undefined)?.role ?? "customer";

  if (userRole !== allowedRole) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Redirecting to the correct dashboard…
      </div>
    );
  }

  return <>{children}</>;
}
