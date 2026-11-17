import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Bell, CalendarClock, CheckCircle2, Clock3, MapPin, ShieldCheck, Sparkles, Wifi, Zap } from "lucide-react"
import Link from "next/link"

const serviceRequests = [
  { id: "FX-1842", customer: "Maya Lewis", issue: "AC not cooling", time: "12 min ago", status: "Assigned" },
  { id: "FX-1893", customer: "Daniel Wu", issue: "Laptop battery swap", time: "29 min ago", status: "Awaiting parts" },
  { id: "FX-1911", customer: "Alicia Gomez", issue: "Smart TV no signal", time: "43 min ago", status: "On route" },
]

const stats = [
  { label: "Jobs completed", value: "1,284", trend: "+18.4%" },
  { label: "Avg. response", value: "17 min", trend: "-6 min" },
  { label: "Customer rating", value: "4.9/5", trend: "+0.3" },
  { label: "Revenue today", value: "$8.2k", trend: "+12.1%" },
]

const technicians = [
  { name: "Ari Patel", specialty: "Appliance diagnostics", availability: "Available now" },
  { name: "Kofi James", specialty: "Electronics repair", availability: "On route" },
  { name: "Nina Cruz", specialty: "Smart home setup", availability: "Available in 30 min" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(52,120,246,0.14),transparent_32%),var(--background)] px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-border bg-card/80 p-4 shadow-[0_20px_60px_rgba(18,32,57,0.08)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-lg font-bold text-white shadow-lg shadow-blue-500/25">
              F
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">FixMate</p>
              <h1 className="text-lg font-semibold text-foreground">Operations dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <Bell className="size-4" />
              Alerts
            </Button>
            <Link href="/">
              <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20">
                Back to home
              </Button>
            </Link>
          </div>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-transparent bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(247,248,252,0.72))] dark:bg-[linear-gradient(180deg,rgba(21,31,50,0.92),rgba(11,18,32,0.92))] shadow-[0_18px_40px_rgba(23,36,59,0.08)]">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="mt-5 flex items-end justify-between gap-3">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</span>
                  <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.08)] backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/80 px-6 py-5">
              <div>
                <CardTitle className="text-xl">Live service queue</CardTitle>
                <CardDescription>Priority repairs assigned in real time</CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1.5 rounded-full">
                <Wifi className="size-3.5" />
                Live feed
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/80">
                {serviceRequests.map((request) => (
                  <div key={request.id} className="grid gap-3 px-6 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{request.id}</span>
                        <span className="text-xs text-muted-foreground">• {request.customer}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{request.issue}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      {request.time}
                    </div>
                    <div className="flex items-center justify-start gap-2 md:justify-end">
                      <Badge variant="outline" className="rounded-full border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-300">
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.08)] backdrop-blur-xl">
            <CardHeader className="border-b border-border/80 px-6 py-5">
              <CardTitle className="text-xl">Technician availability</CardTitle>
              <CardDescription>Field capacity this shift</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {technicians.map((tech) => (
                <div key={tech.name} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3478F6_0%,#17243B_100%)] text-sm font-semibold text-white">
                      {tech.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                    </div>
                  </div>
                  <Badge variant={tech.availability === "Available now" ? "default" : "secondary"} className="rounded-full text-[10px] uppercase tracking-[0.12em]">
                    {tech.availability}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.08),transparent)] shadow-[0_20px_50px_rgba(23,36,59,0.08)]">
            <CardHeader className="px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">Service health</CardTitle>
                  <CardDescription>System reliability across the network</CardDescription>
                </div>
                <Badge className="gap-1.5 rounded-full border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <ShieldCheck className="size-3.5" />
                  Stable
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 px-6 pb-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Dispatch success</span>
                <span className="font-semibold text-foreground">96.4%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[96%] rounded-full bg-[linear-gradient(90deg,#3478F6_0%,#36B99A_100%)]" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: CheckCircle2, label: "Resolved today", value: "214" },
                  { icon: Zap, label: "Average fix time", value: "2.1h" },
                  { icon: MapPin, label: "Coverage", value: "89 zones" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border border-border bg-card/70 p-4">
                    <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.08)]">
            <CardHeader className="px-6 py-5">
              <CardTitle className="text-xl">Next action</CardTitle>
              <CardDescription>Today's highest-priority resolution path</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300">
                  <CalendarClock className="size-4" />
                  <span className="text-sm font-medium">Customer follow-up window</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-foreground">Complete 3 proactive callbacks before 5:30 PM</p>
              </div>

              <div className="space-y-3">
                {[
                  "Confirm replacement part delivery for FX-1893",
                  "Review quote approval for smart-home retrofit",
                  "Send service summary to premium plan clients",
                ].map((task) => (
                  <div key={task} className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-3 text-sm text-foreground">
                    <div className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#36B99A_0%,#3478F6_100%)] text-white">
                      <Sparkles className="size-3.5" />
                    </div>
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              <Button className="mt-2 w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20">
                Review queue
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
