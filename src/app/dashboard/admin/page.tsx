import Link from "next/link";
import { ArrowRight, ClipboardList, Layers3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BackendFeatureNotice, DashboardDataError, DashboardLinkCard } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getAdminDashboardCounts } from "@/lib/dashboard-data";
import { serverApi } from "@/lib/server-api";
import type { BookingRecord } from "@/lib/bookings";

export default async function AdminDashboardPage() {
  const user = await requireDashboardUser("admin");
  let counts: Awaited<ReturnType<typeof getAdminDashboardCounts>> | null = null;
  let loadFailed = false;
  let bookingTotal: number | null = null;

  try {
    counts = await getAdminDashboardCounts();
  } catch (error) {
    console.error("Failed to load admin dashboard counts.", error);
    loadFailed = true;
  }

  try {
    const response = await serverApi<{ data: BookingRecord[]; total?: number }>("/api/bookings");
    bookingTotal = response.total ?? response.data?.length ?? 0;
  } catch (error) {
    console.error("Failed to load booking totals.", error);
  }

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/admin"
      title="Operations overview"
      description="Review real account and service data. Booking and transaction tools need their backend integrations."
    >
      {loadFailed ? <DashboardDataError feature="Admin overview" /> : null}

      {counts ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Accounts", value: counts.accounts, icon: Users, href: "/dashboard/admin/users" },
            { label: "Service listings", value: counts.services, icon: Layers3, href: "/dashboard/admin/services" },
            { label: "Pending service reviews", value: counts.pendingServices, icon: ClipboardList, href: "/dashboard/admin/services" },
            { label: "Repair requests", value: bookingTotal ?? "-", icon: ClipboardList, href: "/dashboard/admin/bookings" },
          ].map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href} className="block rounded-2xl">
              <Card className="h-full border-border bg-card/80 transition-colors hover:border-blue-500/30">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
                  </div>
                  <Icon className="size-5 text-blue-600 dark:text-blue-300" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      ) : !loadFailed ? (
        // ডেটা লোড না হলে বা জিরো থাকলে একটি ডিফল্ট বা স্কেলিটন স্টেট দেখাতে পারেন
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {["Accounts", "Service listings", "Pending service reviews"].map((label) => (
            <Card key={label} className="h-full border-border bg-card/80 opacity-60">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">-</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <DashboardLinkCard
          href="/dashboard/admin/bookings"
          title="Booking management"
          description="Review every repair request read-only; status changes stay with the technician and customer."
        />
        <BackendFeatureNotice
          title="Transaction management is not connected"
          description="No payment provider or transaction collection is configured; payment totals and refund actions are unavailable."
        />
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/admin/users">
          <Button variant="outline" className="rounded-full">View users <ArrowRight className="size-4" /></Button>
        </Link>
        <Link href="/dashboard/admin/services">
          <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">Review services <ArrowRight className="size-4" /></Button>
        </Link>
      </div>
    </DashboardShell>
  );
}