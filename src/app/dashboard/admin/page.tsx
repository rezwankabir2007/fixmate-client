import { Briefcase, CheckCircle2, Gauge, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RoleGuard } from "@/components/auth-guard";

const adminMetrics = [
  { label: "Open tickets", value: "41", icon: Briefcase },
  { label: "Fulfillment rate", value: "96.4%", icon: Gauge },
  { label: "Resolved today", value: "128", icon: CheckCircle2 },
  { label: "System health", value: "Stable", icon: ShieldCheck },
];

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRole="admin">
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <section className="rounded-[30px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.09),transparent)] p-6 shadow-[0_20px_55px_rgba(23,36,59,0.08)] sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Admin dashboard</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground">Operations and service health overview.</h1>
              </div>
              <Badge className="w-fit rounded-full border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                Administrator access
              </Badge>
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {adminMetrics.map(({ label, value, icon: Icon }) => (
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

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.06)]">
              <CardHeader className="px-6 py-5">
                <CardTitle className="text-xl">Priority controls</CardTitle>
                <CardDescription>Mission-critical actions in one place.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6 text-sm text-muted-foreground">
                {[
                  "Approve new service listings",
                  "Review technician availability and assignment queue",
                  "Monitor SLA compliance and escalation levels",
                  "Audit payment and billing state",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-muted/40 p-3">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.06)]">
              <CardHeader className="px-6 py-5">
                <CardTitle className="text-xl">Operational status</CardTitle>
                <CardDescription>Full network performance and reliability.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                {[
                  { label: "Dispatch latency", value: "14 min" },
                  { label: "Live technician count", value: "128" },
                  { label: "Smart contracts", value: "Enabled" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-3">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </main>

        <SiteFooter />
      </div>
    </RoleGuard>
  );
}
