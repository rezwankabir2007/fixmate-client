import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Clock3, Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BackendFeatureNotice,
  DashboardDataError,
  DashboardLinkCard,
} from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getTechnicianServices } from "@/lib/dashboard-data";

export default async function TechnicianDashboardPage() {
  const user = await requireDashboardUser("technician");
  let services = null;
  let loadFailed = false;

  try {
    services = await getTechnicianServices(user.id);
  } catch (error) {
    console.error(`Failed to load services for technician "${user.id}".`, error);
    loadFailed = true;
  }

  const pendingCount = services?.filter((service) => service.status === "pending").length ?? 0;
  const approvedCount = services?.filter((service) => service.status === "approved").length ?? 0;

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/technician"
      title="Technician overview"
      description="Manage your own service listings and see what still needs backend integration."
    >
      {loadFailed ? <DashboardDataError feature="Your service summary" /> : null}
      {services ? (
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Your service listings", value: services.length, icon: Wrench },
            { label: "Pending review", value: pendingCount, icon: Clock3 },
            { label: "Approved", value: approvedCount, icon: BriefcaseBusiness },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="border-border bg-card/80">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
                </div>
                <Icon className="size-5 text-blue-600 dark:text-blue-300" />
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <DashboardLinkCard href="/dashboard/technician/add-service" title="Add a service" description="Submit a listing for admin review." />
        <DashboardLinkCard href="/dashboard/technician/my-services" title="My services" description="View only listings submitted by your account." />
      </section>

      <section className="mt-6">
        <BackendFeatureNotice
          title="Booking requests are not connected"
          description="No booking collection or request assignment flow exists in this project yet. Request counts and job actions are intentionally omitted."
        />
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/technician/requests">
          <Button variant="outline" className="rounded-full">View requests <ArrowRight className="size-4" /></Button>
        </Link>
        <Link href="/dashboard/technician/add-service">
          <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white"><Plus className="size-4" /> Add service</Button>
        </Link>
      </div>
    </DashboardShell>
  );
}
