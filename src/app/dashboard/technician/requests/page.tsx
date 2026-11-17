import { BackendFeatureNotice, EmptyTable } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function TechnicianRequestsPage() {
  const user = await requireDashboardUser("technician");

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/technician/requests"
      title="Booking requests"
      description="Requests should be scoped to services and bookings assigned to your technician account."
    >
      <BackendFeatureNotice
        title="Request assignment backend required"
        description="No booking collection or technician assignment API exists yet. The page will not show other technicians’ requests or create sample jobs."
      />
      <div className="mt-5">
        <EmptyTable
          title="No request data is connected"
          description="A booking/request model with a server-enforced technicianId filter is required."
          columns={5}
          headers={["Request", "Service", "Customer", "Requested time", "Status"]}
        />
      </div>
    </DashboardShell>
  );
}
