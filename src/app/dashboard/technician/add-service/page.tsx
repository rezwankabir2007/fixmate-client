import { DashboardShell } from "@/components/dashboard-shell";
import { TechnicianServiceForm } from "@/components/technician-service-form";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export const instant = false;


export default async function TechnicianAddServicePage() {
  const user = await requireDashboardUser("technician");

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/technician/add-service"
      title="Submit a service"
      description="New listings are saved as pending and remain private until an admin approves them."
    >
      <TechnicianServiceForm />
    </DashboardShell>
  );
}
