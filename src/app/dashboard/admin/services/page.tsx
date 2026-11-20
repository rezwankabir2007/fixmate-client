
import { AdminServiceActions } from "@/components/admin-service-actions";
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
import { getAdminServices } from "@/lib/dashboard-data";

export const instant = false;

export default async function AdminServicesPage() {
  const user = await requireDashboardUser("admin");

  let services: Awaited<ReturnType<typeof getAdminServices>> | null = null;
  let loadFailed = false;

  try {
    services = await getAdminServices();
  } catch (error) {
    console.error("Failed to load admin service list.", error);
    loadFailed = true;
  }

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/admin/services"
      title="Service listings"
      description="Review services from MongoDB. Approving a pending listing makes it publicly available."
    >
      {loadFailed ? (
        <DashboardDataError feature="Service listings" />
      ) : null}

      {services ? (
        <div className="rounded-2xl border border-border bg-card/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {services.length ? (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.title}
                    </TableCell>

                    <TableCell>{service.category}</TableCell>

                    <TableCell
                      className="max-w-36 truncate"
                      title={service.technicianId ?? undefined}
                    >
                      {service.technicianId ?? "—"}
                    </TableCell>

                    <TableCell>
                      {service.price === null
                        ? "—"
                        : `$${service.price}`}
                    </TableCell>

                    <TableCell className="capitalize">
                      {service.status}
                    </TableCell>

                    <TableCell>
                      {service.status === "pending" ? (
                        <AdminServiceActions serviceId={service.id} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 whitespace-normal text-center text-muted-foreground"
                  >
                    No service listings are stored.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {services.length === 200 ? (
            <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              Showing the latest 200 listings.
            </p>
          ) : null}
        </div>
      ) : null}
    </DashboardShell>
  );
}
