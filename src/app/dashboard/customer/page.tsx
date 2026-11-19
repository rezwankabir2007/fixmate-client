import { Card, CardContent } from "@/components/ui/card";
import { DashboardLinkCard, DashboardDataError } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { serverApi } from "@/lib/server-api";
import { isActiveBooking, type BookingRecord } from "@/lib/bookings";

export default async function CustomerDashboardPage() {
  const user = await requireDashboardUser("customer");

  let bookings: BookingRecord[] | null = null;
  let loadFailed = false;

  try {
    const response = await serverApi<{ data: BookingRecord[] }>("/api/bookings/mine");
    bookings = response.data ?? [];
  } catch (error) {
    console.error(`Failed to load bookings for customer "${user.id}".`, error);
    loadFailed = true;
  }

  const activeCount = bookings?.filter((booking) => isActiveBooking(booking.status)).length ?? 0;
  const completedCount = bookings?.filter((booking) => booking.status === "completed").length ?? 0;

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/customer"
      title={`Welcome${user.name ? `, ${user.name}` : ""}`}
      description="Your personal repair workspace."
    >
      {loadFailed ? <DashboardDataError feature="Your bookings" /> : null}

      {bookings ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "Total requests", detail: String(bookings.length) },
            { title: "Active requests", detail: String(activeCount) },
            { title: "Completed repairs", detail: String(completedCount) },
          ].map((item) => (
            <Card key={item.title} className="border-border bg-card/80">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{item.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Live from your booking records.
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { title: "Bookings", href: "/dashboard/customer/bookings", description: "Track, cancel, or pay for your repair requests." },
          { title: "Payments", href: "/dashboard/customer/payments", description: "Payment history for completed repairs." },
          { title: "Browse services", href: "/services", description: "Find a technician and request a repair." },
        ].map(({ title, href, description }) => (
          <DashboardLinkCard key={title} href={href} title={title} description={description} />
        ))}
      </section>
    </DashboardShell>
  );
}
