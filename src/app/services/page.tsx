import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getApprovedAvailableServices, serviceCategories } from "@/lib/services"

const services = getApprovedAvailableServices()

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.08),transparent)] p-6 shadow-[0_25px_70px_rgba(23,36,59,0.08)] sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">FixMate services</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">Expert repair support for everyday essentials.</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-4" />
              6 newest approved services
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {serviceCategories.map((category) => (
              <div key={category} className="rounded-[24px] border border-border bg-card/80 p-4 shadow-[0_18px_35px_rgba(23,36,59,0.04)]">
                <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.12))] text-blue-600 dark:text-blue-300">
                  <Sparkles className="size-4" />
                </div>
                <p className="text-lg font-semibold text-foreground">{category}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground">Latest available services</h2>
            <span className="rounded-full border border-border bg-card/80 px-3 py-1.5 text-sm text-muted-foreground">Sorted newest first</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="group overflow-hidden border-border bg-card/80 shadow-[0_20px_45px_rgba(23,36,59,0.06)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(23,36,59,0.12)]">
                <div className="overflow-hidden">
                  <img src={service.image} alt={service.title} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <CardHeader className="px-5 pt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-blue-700 dark:text-blue-200">
                      {service.category}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 className="size-3" /> Available
                    </span>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6">{service.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-5 pb-5">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="size-4 text-blue-600" />
                      {service.duration}
                    </span>
                    <span className="text-lg font-semibold text-foreground">${service.price}</span>
                  </div>

                  <Link href={`/services/${service.id}`}>
                    <Button className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
                      More details
                      <ArrowRight className="size-4" />
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
