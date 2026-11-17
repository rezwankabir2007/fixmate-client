import { BackendFeatureNotice, EmptyTable } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function CustomerBookingsPage() {
  const user = await requireDashboardUser("customer");

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/customer/bookings"
      title="Your bookings"
      description="Only your own booking records belong in this workspace."
    >
      <BackendFeatureNotice
        title="Bookings backend required"
        description="There is no booking collection or booking API in the current project. This page does not load or invent booking records."
      />
      <div className="mt-5">
        <EmptyTable
          title="No booking data is connected"
          description="A customer-scoped booking API is needed before bookings can appear here."
          columns={5}
          headers={["Booking", "Service", "Technician", "Schedule", "Status"]}
        />
      </div>
    </DashboardShell>
  );
}
