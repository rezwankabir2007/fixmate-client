import { BriefcaseBusiness, MapPin, ShieldCheck, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RoleGuard } from "@/components/auth-guard";

const jobs = [
  { title: "Aircon diagnostics", customer: "Maya Lewis", eta: "18 min", status: "En route" },
  { title: "Washing machine fix", customer: "Raj Patel", eta: "42 min", status: "Assigned" },
  { title: "Laptop battery upgrade", customer: "Alicia Gomez", eta: "1 hr", status: "Booked" },
];

export default function TechnicianDashboardPage() {
  return (
    <RoleGuard allowedRole="technician">
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <section className="rounded-[30px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.08),rgba(54,185,154,0.08),transparent)] p-6 shadow-[0_20px_55px_rgba(23,36,59,0.08)] sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Technician dashboard</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground">Field operations overview.</h1>
              </div>
              <Badge className="w-fit rounded-full border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                Shift active
              </Badge>
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Jobs today", value: "12", icon: BriefcaseBusiness },
              { label: "Average ETA", value: "17 min", icon: TimerReset },
              { label: "Service zone", value: "Zone 4", icon: MapPin },
              { label: "Safety score", value: "98%", icon: ShieldCheck },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="border-border bg-card/80 shadow-[0_18px_35px_rgba(23,36,59,0.04)]">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.12))] text-blue-600 dark:text-blue-300">
                    <Icon className="size-5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="mt-8">
            <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.06)]">
              <CardHeader className="px-6 py-5">
                <CardTitle className="text-xl">Assigned jobs</CardTitle>
                <CardDescription>Prioritized work for your active route.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                {jobs.map((job) => (
                  <div key={job.title} className="rounded-2xl border border-border bg-muted/40 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">Customer: {job.customer}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="rounded-full">{job.status}</Badge>
                        <span className="text-sm text-muted-foreground">ETA {job.eta}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="mt-2 w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
                  View full job queue
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>

        <SiteFooter />
      </div>
    </RoleGuard>
  );
}
