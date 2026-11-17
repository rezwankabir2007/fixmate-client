import { Activity, CalendarCheck2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RoleGuard } from "@/components/auth-guard";

const nextServices = [
  { title: "Smartphone screen fix", date: "Today, 3:30 PM", status: "Assigned" },
  { title: "AC maintenance", date: "Tomorrow, 10:00 AM", status: "Scheduled" },
  { title: "TV diagnostics", date: "Thu, 1:15 PM", status: "Awaiting approval" },
];

export default function CustomerDashboardPage() {
  return (
    <RoleGuard allowedRole="customer">
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <section className="rounded-[30px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.1),rgba(54,185,154,0.08),transparent)] p-6 shadow-[0_20px_55px_rgba(23,36,59,0.08)] sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Customer dashboard</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground">Your repair care at a glance.</h1>
              </div>
              <Badge className="w-fit rounded-full border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                Active account
              </Badge>
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Open repairs", value: "3", icon: Activity },
              { label: "Upcoming visits", value: "2", icon: CalendarCheck2 },
              { label: "Saved cards", value: "1", icon: CreditCard },
              { label: "Coverage", value: "98%", icon: ShieldCheck },
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

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.06)]">
              <CardHeader className="px-6 py-5">
                <CardTitle className="text-xl">Upcoming service plan</CardTitle>
                <CardDescription>Track the next repairs and technician updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                {nextServices.map((service) => (
                  <div key={service.title} className="rounded-2xl border border-border bg-muted/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">{service.title}</p>
                      <Badge variant="secondary" className="rounded-full">{service.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{service.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.06)]">
              <CardHeader className="px-6 py-5">
                <CardTitle className="text-xl">Premium care</CardTitle>
                <CardDescription>What you get with FixMate Plus.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6 text-sm text-muted-foreground">
                {[
                  "Priority scheduling for urgent repairs",
                  "Transparent quotes before approval",
                  "Ongoing warranty guidance after service",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-3">
                    <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                      <Sparkles className="size-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
                <Button className="mt-2 w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
                  Book another service
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
