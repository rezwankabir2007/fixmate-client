import { DashboardDataError } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getTechnicianServices } from "@/lib/dashboard-data";

export default async function TechnicianServicesPage() {
  const user = await requireDashboardUser("technician");
  let services = null;
  let loadFailed = false;

  try {
    services = await getTechnicianServices(user.id);
  } catch (error) {
    console.error(`Failed to load technician services for "${user.id}".`, error);
    loadFailed = true;
  }

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/technician/my-services"
      title="My services"
      description="This list is filtered on the server to services submitted by your account."
    >
      {loadFailed ? <DashboardDataError feature="Your service listings" /> : null}
      {services ? (
        <div className="rounded-2xl border border-border bg-card/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Review status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length ? services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.price === null ? "—" : `$${service.price}`}</TableCell>
                  <TableCell>{service.available ? "Available" : "Not public"}</TableCell>
                  <TableCell className="capitalize">{service.status}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 whitespace-normal text-center text-muted-foreground">
                    You have not submitted any service listings.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </DashboardShell>
  );
}
