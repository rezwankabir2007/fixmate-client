import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getPublicServiceById, getRelatedPublicServices } from "@/lib/service-repository"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  let service

  try {
    service = await getPublicServiceById(id)
  } catch (error) {
    console.error(`Failed to load metadata for service "${id}".`, error)
    return { title: "Service details | FixMate" }
  }

  if (!service) {
    return { title: "Service not found | FixMate" }
  }

  return {
    title: `${service.title} | FixMate`,
    description: service.shortDescription,
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let service
  let relatedServices

  try {
    service = await getPublicServiceById(id)
    if (service) relatedServices = await getRelatedPublicServices(service)
  } catch (error) {
    console.error(`Failed to load service details for "${id}".`, error)

    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div role="alert" className="rounded-[28px] border border-red-500/20 bg-red-500/5 p-8 text-center">
            <h1 className="text-2xl font-semibold text-foreground">Service details are temporarily unavailable</h1>
            <p className="mt-3 text-muted-foreground">Please try again in a moment or browse the full service catalog.</p>
            <Link href="/services" className="mt-6 inline-flex">
              <Button variant="outline" className="rounded-full">Back to services</Button>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!service) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <Link href="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to services
        </Link>

        <section className="mt-6 overflow-hidden rounded-[32px] border border-border bg-card/80 shadow-[0_25px_70px_rgba(23,36,59,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden">
              <img src={service.image} alt={service.title} className="h-full min-h-[320px] w-full object-cover" />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-200">{service.category}</Badge>
                <Badge className="rounded-full border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 className="size-3.5" /> Available
                </Badge>
                {service.serviceMode ? (
                  <Badge variant="outline" className="rounded-full">{service.serviceMode}</Badge>
                ) : null}
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-foreground">{service.title}</h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{service.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2">
                  <Clock3 className="size-4 text-blue-600" />
                  {service.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Warranty support included
                </span>
              </div>

              <div className="mt-8 rounded-[24px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.08),rgba(54,185,154,0.06),transparent)] p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Starting from</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-foreground">${service.price}</span>
                  <span className="pb-1 text-sm text-muted-foreground">one-time fee</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20">
                  Book this service
                </Button>
                <Button variant="outline" className="rounded-full">
                  Talk to an expert
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.05)]">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-2xl">What this service includes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 text-base leading-7 text-muted-foreground">
              <p>{service.description}</p>
              <ul className="space-y-3">
                {[
                  "Certified technician assessment",
                  "Transparent diagnosis and repair timeline",
                  "Safe handling and post-service testing",
                  "Follow-up support and warranty guidance",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 className="size-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.05)]">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-2xl">Why customers choose FixMate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              {[
                { label: "Technician rating", value: "4.9/5" },
                { label: "Response time", value: "14 mins" },
                { label: "Coverage", value: "89 service zones" },
                { label: "Support", value: "24/7 live assistance" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-3">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground">More services</h2>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Explore all
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {(relatedServices ?? []).map((item) => (
              <Card key={item.id} className="overflow-hidden border-border bg-card/80 shadow-[0_18px_35px_rgba(23,36,59,0.06)]">
                <div className="overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
                </div>
                <CardHeader className="px-5 pt-5">
                  <Badge className="w-fit rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-200">{item.category}</Badge>
                  <CardTitle className="mt-3 text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <Link href={`/services/${item.id}`}>
                    <Button variant="outline" className="w-full rounded-full">
                      View service
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
