import { ArrowRight, CheckCircle2, ShieldCheck, Star, Users, Wrench } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

const values = [
  {
    icon: ShieldCheck,
    title: "Quality first",
    description: "Every repair is inspected to ensure reliability, safety, and a professional finish.",
  },
  {
    icon: Users,
    title: "People-first support",
    description: "We prioritize clear communication, empathy, and dependable service at every touchpoint.",
  },
  {
    icon: Wrench,
    title: "Practical expertise",
    description: "Our certified technicians bring hands-on experience across devices, appliances, and electrical systems.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.08),transparent)] p-6 shadow-[0_25px_70px_rgba(23,36,59,0.08)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">About FixMate</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">Repair service built around trust, speed, and real expertise.</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                FixMate helps households and businesses solve everyday technology and appliance issues through verified technicians, transparent guidance, and premium support from first booking to final sign-off.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/services">
                  <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20">
                    Explore services
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-border bg-card/80 p-5 shadow-[0_20px_50px_rgba(23,36,59,0.08)]">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Verified techs", value: "1,200+" },
                  { label: "Customer rating", value: "4.9/5" },
                  { label: "Cities covered", value: "89" },
                  { label: "Success rate", value: "96.4%" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border bg-card/80 shadow-[0_18px_35px_rgba(23,36,59,0.06)]">
              <CardHeader className="p-5">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.12))] text-blue-600 dark:text-blue-300">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <CardDescription className="text-base leading-7">{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-border bg-card/80 p-6 shadow-[0_20px_50px_rgba(23,36,59,0.08)]">
            <p className="text-sm uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Our mission</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground">Make home repair simple, transparent, and dependable.</h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              We combine fast dispatch, expert service, and clear communication to help customers restore comfort, productivity, and safety without the usual stress of repairs. Every FixMate interaction is designed to be efficient, reassuring, and results-driven.
            </p>
          </div>

          <div className="rounded-[30px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.08),rgba(54,185,154,0.08),transparent)] p-6 shadow-[0_20px_50px_rgba(23,36,59,0.08)]">
            <p className="text-sm uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">What sets us apart</p>
            <div className="mt-5 space-y-4">
              {[
                "Certified technicians for home and business support",
                "Clear quotes and repair progress updates",
                "Flexible scheduling for urgent and routine issues",
                "Post-service guidance and warranty support",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-card/80 p-3 text-sm text-foreground">
                  <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                    <CheckCircle2 className="size-3.5" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[30px] border border-border bg-card/80 p-6 shadow-[0_20px_50px_rgba(23,36,59,0.08)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Why people stay with FixMate</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground">Trusted service that feels premium from the first call.</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
              <Star className="size-4 fill-current" />
              Rated 4.9 by customers
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
