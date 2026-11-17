"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    const role = (session.user as { role?: string } | undefined)?.role ?? "customer";
    const path = role === "admin" ? "/dashboard/admin" : role === "technician" ? "/dashboard/technician" : "/dashboard/customer";
    router.replace(path);
  }, [isPending, router, session]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="rounded-[28px] border border-border bg-card/80 px-6 py-5 text-sm text-muted-foreground shadow-[0_18px_45px_rgba(23,36,59,0.08)]">
        Redirecting to your dashboard…
      </div>
    </div>
  );
}
