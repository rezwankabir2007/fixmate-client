import { Card, CardContent } from "@/components/ui/card";
import { DashboardLinkCard, BackendFeatureNotice } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function CustomerDashboardPage() {
  const user = await requireDashboardUser("customer");

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/customer"
      title={`Welcome${user.name ? `, ${user.name}` : ""}`}
      description="Your personal repair workspace."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { title: "Bookings", href: "/dashboard/customer/bookings" },
          { title: "Payments", href: "/dashboard/customer/payments" },
          { title: "Browse services", href: "/services" },
        ].map(({ title, href }) => (
          <DashboardLinkCard key={title} href={href} title={title} description={`Open your ${title.toLowerCase()} area.`} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { title: "Your bookings", detail: "Not connected" },
          { title: "Your payments", detail: "Not connected" },
        ].map((item) => (
          <Card key={item.title} className="border-border bg-card/80">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{item.detail}</p>
              <p className="mt-1 text-xs text-muted-foreground">No records or totals are simulated.</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="mt-6">
        <BackendFeatureNotice
          title="Booking and payment data is not connected"
          description="The project does not yet have booking or transaction APIs/collections. Booking creation, cancellation, and payment actions are unavailable until those are implemented."
        />
      </div>
    </DashboardShell>
  );
}
