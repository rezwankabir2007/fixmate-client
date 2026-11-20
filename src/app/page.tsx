
export const instant = false;

import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";

import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock3,
  Cpu,
  Gauge,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import { serviceCategories } from "@/lib/services";
import {
  getFeaturedServices,
  type Service,
} from "@/app/api/services";
import Image from "next/image";

const stats = [
  { label: "Repairs completed", value: "16.8k" },
  { label: "Average response", value: "18 min" },
  { label: "Customer satisfaction", value: "4.9/5" },
];

const categoryIcons = [
  Wrench,
  Cpu,
  Gauge,
  ShieldCheck,
  Sparkles,
  Zap,
  BellRing,
] as const;

const servicePillars = [
  {
    icon: Wrench,
    title: "Smart home fixes",
    description:
      "Install, troubleshoot, and tune connected devices across the whole home.",
  },
  {
    icon: Cpu,
    title: "Device diagnostics",
    description:
      "Fast, expert repair intelligence for phones, laptops, and appliances.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty-first care",
    description:
      "Transparent service quality with protection and verified workmanship.",
  },
];

const flow = [
  {
    step: "01",
    title: "Book in seconds",
    text: "Choose a service, schedule, and technician profile that fits your needs.",
  },
  {
    step: "02",
    title: "Get a live update",
    text: "Track the repair progress, ETA, and technician status in real time.",
  },
  {
    step: "03",
    title: "Enjoy premium care",
    text: "Approve completion, access follow-up support, and keep your home running.",
  },
];

const highlights = [
  {
    icon: Gauge,
    title: "Rapid dispatch",
    detail: "Coverage across 89 service zones",
  },
  {
    icon: BellRing,
    title: "Proactive alerts",
    detail: "Stay informed before and after service",
  },
  {
    icon: Sparkles,
    title: "Premium materials",
    detail: "Certified parts and refined finish work",
  },
];

function FeaturedServicesSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-96 animate-pulse rounded-2xl border border-border bg-card/80 p-5"
        >
          <div className="h-44 w-full rounded-xl bg-muted" />
          <div className="mt-4 h-6 w-2/3 rounded bg-muted" />
          <div className="mt-2 h-4 w-full rounded bg-muted" />
          <div className="mt-6 h-10 w-full rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

async function LatestServicesList() {
  // Wait until the incoming request before fetching dynamic services.
  await connection();

  let latestServices: Service[] = [];

  try {
    latestServices = await getFeaturedServices();
  } catch (error) {
    console.error("Failed to fetch featured services:", error);

    return (
      <div className="rounded-2xl border border-border bg-card/80 p-6 text-center text-sm text-muted-foreground">
        Featured services could not be loaded right now.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {latestServices.map((service: Service, index: number) => {
        const Icon = categoryIcons[index % categoryIcons.length];

        return (
          <Card
            key={service.id}
            className="group overflow-hidden border-border bg-card/80 shadow-[0_18px_38px_rgba(23,36,59,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_55px_rgba(23,36,59,0.12)]"
          >
            <div className="overflow-hidden">
              <Image
                src={service.image || "/placeholder-service.jpg"}
                alt={service.title}
                width={500}
                height={300}
                className="h-48 w-full object-cover"
                unoptimized
              />
            </div>

            <CardHeader className="px-5 pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-blue-700 dark:text-blue-200">
                  {service.category}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 className="size-3" />
                  Approved
                </span>
              </div>

              <CardTitle className="text-xl">
                {service.title}
              </CardTitle>

              <CardDescription className="mt-2 text-sm leading-6">
                {service.shortDescription}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-5 pb-5">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Icon className="size-4 text-blue-600" />
                  {service.duration}
                </span>

                <span className="text-xl font-semibold text-foreground">
                  ${service.price}
                </span>
              </div>

              <Link href={`/services/${service.id}`}>
                <Button className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
                  View details
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top,_rgba(52,120,246,0.14),transparent_28%),linear-gradient(180deg,var(--background)_0%,rgba(247,248,252,0.96)_100%)] text-foreground dark:bg-[radial-gradient(circle_at_top,_rgba(52,120,246,0.18),transparent_30%),linear-gradient(180deg,#0B1220_0%,#0E172A_100%)]">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <main className="space-y-14">
          <section className="grid items-center gap-8 pb-8 pt-6 lg:grid-cols-[1.2fr_0.8fr] lg:pt-10">
            <div>
              <Badge className="mb-5 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1 text-blue-700 dark:text-blue-200">
                Trusted repair specialists • 24/7 support
              </Badge>

              <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl">
                Premium repair care for the modern home.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                FixMate connects homeowners, property managers, and small
                businesses with vetted technicians for urgent diagnostics,
                scheduled maintenance, and intelligent repair support.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/services">
                  <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] px-5 text-base text-white shadow-[0_18px_40px_rgba(52,120,246,0.28)]">
                    Book a repair
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>

                <Link href="#services">
                  <Button variant="outline" className="rounded-full px-5 text-base">
                    Explore services
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border bg-card/80 p-4 shadow-[0_18px_40px_rgba(23,36,59,0.04)] backdrop-blur-sm"
                  >
                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle,_rgba(52,120,246,0.25),transparent_60%)] blur-3xl" />

              <div className="rounded-[32px] border border-border bg-[linear-gradient(160deg,rgba(23,36,59,0.92),rgba(52,120,246,0.92))] p-4 shadow-[0_40px_90px_rgba(26,39,60,0.25)]">
                <div className="rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),transparent_36%),#0F1B2F] p-5 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-blue-100/75">
                        Service status
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold">
                        Live dispatch
                      </h2>
                    </div>

                    <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                      Online
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      {
                        title: "Aircon tune-up",
                        time: "In progress • 18 min",
                        tone: "bg-emerald-400/15 text-emerald-200",
                      },
                      {
                        title: "Smart TV diagnostics",
                        time: "On the way • 6 min",
                        tone: "bg-blue-400/10 text-blue-100",
                      },
                      {
                        title: "Washer repair",
                        time: "Awaiting approval • 3 min",
                        tone: "bg-amber-400/15 text-amber-100",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/4 p-3"
                      >
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-slate-300">
                            {item.time}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${item.tone}`}
                        >
                          Active
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                        Response
                      </p>
                      <p className="mt-3 text-2xl font-semibold">14 min</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                        Satisfaction
                      </p>
                      <p className="mt-3 text-2xl font-semibold">98%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                  Repair categories
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
                  Service designed around real-life breakdowns.
                </h2>
              </div>

              <Badge
                variant="secondary"
                className="w-fit rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.18em]"
              >
                Home • office • property
              </Badge>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {servicePillars.map(({ icon: Icon, title, description }) => (
                <Card
                  key={title}
                  className="group border-border bg-card/80 shadow-[0_18px_40px_rgba(23,36,59,0.06)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(23,36,59,0.12)]"
                >
                  <CardHeader className="p-5">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(52,120,246,0.14),rgba(54,185,154,0.12))] text-[var(--electric-blue)]">
                      <Icon className="size-5" />
                    </div>

                    <CardTitle className="text-xl">{title}</CardTitle>
                  </CardHeader>

                  <CardContent className="px-5 pb-5">
                    <CardDescription className="text-base leading-7">
                      {description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                  Popular repairs
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
                  Latest approved services
                </h2>
              </div>

              <Link href="/services">
                <Button
                  variant="outline"
                  className="rounded-full px-4 py-2 text-sm"
                >
                  View all services
                </Button>
              </Link>
            </div>

            <Suspense fallback={<FeaturedServicesSkeleton />}>
              <LatestServicesList />
            </Suspense>
          </section>

          <section className="space-y-6">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                Service categories
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
                Repair support for every essential device.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {serviceCategories.map(
                (category: string, index: number) => {
                  const Icon =
                    categoryIcons[index % categoryIcons.length];

                  return (
                    <div
                      key={category}
                      className="rounded-[24px] border border-border bg-card/80 p-4 shadow-[0_18px_35px_rgba(23,36,59,0.04)]"
                    >
                      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.12))] text-blue-600 dark:text-blue-300">
                        <Icon className="size-4" />
                      </div>

                      <h3 className="text-lg font-semibold text-foreground">
                        {category}
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Specialist diagnostics and repair coverage by
                        certified technicians.
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          <section
            id="process"
            className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div className="rounded-[30px] border border-border bg-[linear-gradient(135deg,rgba(23,36,59,0.97),rgba(18,29,46,0.96))] p-6 text-white shadow-[0_30px_80px_rgba(13,19,28,0.28)]">
              <p className="text-sm uppercase tracking-[0.22em] text-blue-200">
                Why customers trust us
              </p>

              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
                Built for speed, clarity, and confidence.
              </h3>

              <div className="mt-6 space-y-4">
                {highlights.map(({ icon: Icon, title, detail }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/4 p-3"
                  >
                    <div className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-white/8 text-blue-200">
                      <Icon className="size-4" />
                    </div>

                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="mt-1 text-sm text-slate-300">
                        {detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {flow.map(({ step, title, text }) => (
                <Card
                  key={step}
                  className="border-border bg-card/80 shadow-[0_18px_40px_rgba(23,36,59,0.05)]"
                >
                  <CardContent className="flex gap-4 p-5 sm:p-6">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                      {step}
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-foreground">
                        {title}
                      </h4>

                      <p className="mt-2 text-base leading-7 text-muted-foreground">
                        {text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section
            id="coverage"
            className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="rounded-[30px] border border-border bg-card/80 p-6 shadow-[0_20px_50px_rgba(23,36,59,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                    Coverage map
                  </p>

                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                    Repair support where you need it.
                  </h3>
                </div>

                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.18em]"
                >
                  89 zones
                </Badge>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: MapPin,
                    value: "14 min",
                    label: "Average arrival in metro",
                  },
                  {
                    icon: Clock3,
                    value: "24/7",
                    label: "Emergency support",
                  },
                  {
                    icon: CheckCircle2,
                    value: "1,200+",
                    label: "Verified technicians",
                  },
                  {
                    icon: Star,
                    value: "4.9/5",
                    label: "Customer satisfaction",
                  },
                ].map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border bg-muted/40 p-4"
                  >
                    <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                      <Icon className="size-4" />
                    </div>

                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                      {value}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="pricing"
              className="rounded-[30px] border border-border bg-[linear-gradient(180deg,rgba(52,120,246,0.08),rgba(54,185,154,0.06),transparent)] p-6 shadow-[0_20px_50px_rgba(23,36,59,0.08)]"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                Flexible plans
              </p>

              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Simple, premium pricing.
              </h3>

              <div className="mt-6 space-y-4">
                {[
                  "Priority booking with technician matching",
                  "Same-day diagnostics and scheduling",
                  "Member-only repair check-ins and warranty support",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-3 text-sm text-foreground"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                      <Zap className="size-4" />
                    </div>

                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[26px] border border-blue-500/20 bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] p-5 text-white shadow-lg shadow-blue-500/20">
                <p className="text-sm uppercase tracking-[0.2em] text-blue-100">
                  Premium plan
                </p>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight">
                    $49
                  </span>
                  <span className="pb-1 text-base text-blue-100">
                    / month
                  </span>
                </div>

                <p className="mt-2 text-sm text-blue-100">
                  Includes proactive maintenance, repair credit, and priority
                  dispatch.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
