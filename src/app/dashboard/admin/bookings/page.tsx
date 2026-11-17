import { BackendFeatureNotice, EmptyTable } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function AdminBookingsPage() {
  const user = await requireDashboardUser("admin");

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/admin/bookings"
      title="Booking management"
      description="Administrative booking review requires a real booking lifecycle."
    >
      <BackendFeatureNotice
        title="Booking management backend required"
        description="There is no booking collection, status transition API, or assignment policy in the current project."
      />
      <div className="mt-5">
        <EmptyTable
          title="Booking records are not connected"
          description="No bookings are being simulated or read from unrelated collections."
          columns={6}
          headers={["Booking", "Customer", "Service", "Technician", "Schedule", "Status"]}
        />
      </div>
    </DashboardShell>
  );
}
