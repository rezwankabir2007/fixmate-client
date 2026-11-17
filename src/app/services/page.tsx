import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { serviceCategories } from "@/lib/services";
import {
  getPublicServices,
  parseServiceListParams,
  type ServiceListParams,
} from "@/lib/service-repository";

type SearchParams = Record<string, string | string[] | undefined>;

function buildServicesUrl(params: ServiceListParams, page: number) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.serviceMode) query.set("serviceMode", params.serviceMode);
  if (params.sort !== "newest") query.set("sort", params.sort);
  if (params.limit !== 6) query.set("limit", String(params.limit));
  query.set("page", String(page));
  return `/services?${query.toString()}`;
}

function buildCategoryUrl(params: ServiceListParams | null, category: string) {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.serviceMode) query.set("serviceMode", params.serviceMode);
  if (params?.sort && params.sort !== "newest") query.set("sort", params.sort);
  if (params?.limit && params.limit !== 6) query.set("limit", String(params.limit));
  query.set("category", category);
  query.set("page", "1");
  return `/services?${query.toString()}`;
}

function ServiceCard({ service }: { service: Awaited<ReturnType<typeof getPublicServices>>["services"][number] }) {
  return (
    <Card className="group overflow-hidden border-border bg-card/80 shadow-[0_20px_45px_rgba(23,36,59,0.06)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(23,36,59,0.12)]">
      <div className="overflow-hidden">
        <img src={service.image} alt={service.title} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <CardHeader className="px-5 pt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-blue-700 dark:text-blue-200">
            {service.category}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="size-3" />
            Available
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
        {service.serviceMode ? (
          <p className="text-xs text-muted-foreground">Service mode: {service.serviceMode}</p>
        ) : null}
        <Link href={`/services/${encodeURIComponent(service.id)}`}>
          <Button className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
            More details
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ServiceDataError() {
  return (
    <div role="alert" className="rounded-[24px] border border-red-500/20 bg-red-500/5 p-6 text-center">
      <h2 className="text-xl font-semibold text-foreground">Services are temporarily unavailable</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn&apos;t load the service catalog. Please try again in a moment.
      </p>
      <Link href="/services" className="mt-4 inline-flex">
        <Button variant="outline" className="rounded-full">Try again</Button>
      </Link>
    </div>
  );
}

export default async function ServicesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const rawSearchParams = await searchParams;
  const parsed = parseServiceListParams(rawSearchParams);
  let result: Awaited<ReturnType<typeof getPublicServices>> | null = null;
  let loadFailed = false;

  if ("params" in parsed) {
    try {
      result = await getPublicServices(parsed.params);
    } catch (error) {
      console.error("Failed to load public services from MongoDB.", error);
      loadFailed = true;
    }
  }

  const params = "params" in parsed ? parsed.params : null;
  const totalPages = result ? Math.ceil(result.total / result.limit) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.08),transparent)] p-6 shadow-[0_25px_70px_rgba(23,36,59,0.08)] sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">FixMate services</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                Find the right repair for the things you rely on.
              </h1>
            </div>
            {result ? (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-4" />
                {result.total} approved and available {result.total === 1 ? "service" : "services"}
              </div>
            ) : null}
          </div>
        </section>

        <section aria-label="Browse service categories" className="mt-8">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
            {serviceCategories.map((category) => (
              <Link
                key={category}
                href={buildCategoryUrl(params, category)}
                className={`rounded-2xl border p-4 text-sm font-medium transition-colors hover:border-blue-500/40 hover:bg-blue-500/5 ${
                  params?.category === category ? "border-blue-500/40 bg-blue-500/5 text-blue-700 dark:text-blue-200" : "border-border bg-card/80 text-foreground"
                }`}
              >
                <Sparkles className="mb-3 size-4 text-blue-600 dark:text-blue-300" />
                {category}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[24px] border border-border bg-card/80 p-5 shadow-[0_18px_40px_rgba(23,36,59,0.05)]">
          <form action="/services" method="get" className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(150px,1fr))_auto] xl:items-end">
            <div className="space-y-2">
              <label htmlFor="q" className="text-sm font-medium text-foreground">Search title or category</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input id="q" name="q" defaultValue={params?.q ?? ""} maxLength={100} placeholder="e.g. laptop or AC" className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-foreground">Category</label>
              <select id="category" name="category" defaultValue={params?.category ?? ""} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground">
                <option value="">All categories</option>
                {serviceCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            {result && result.serviceModes.length > 0 ? (
              <div className="space-y-2">
                <label htmlFor="serviceMode" className="text-sm font-medium text-foreground">Service mode</label>
                <select id="serviceMode" name="serviceMode" defaultValue={params?.serviceMode ?? ""} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground">
                  <option value="">All modes</option>
                  {result.serviceModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
                </select>
              </div>
            ) : null}
            <div className="space-y-2">
              <label htmlFor="sort" className="text-sm font-medium text-foreground">Sort by</label>
              <select id="sort" name="sort" defaultValue={params?.sort ?? "newest"} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground">
                <option value="newest">Newest</option>
                <option value="price-asc">Lowest price</option>
                <option value="price-desc">Highest price</option>
              </select>
            </div>
            <input type="hidden" name="page" value="1" />
            <input type="hidden" name="limit" value={params?.limit ?? 6} />
            <div className="flex gap-2">
              <Button type="submit" className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white xl:w-auto">
                Apply filters
              </Button>
              <Link href="/services">
                <Button type="button" variant="outline" className="rounded-full">Clear</Button>
              </Link>
            </div>
          </form>
        </section>

        <section className="mt-10 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Repair catalog</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                {params?.category ? `${params.category} services` : "Available services"}
              </h2>
            </div>
            {result ? <span className="text-sm text-muted-foreground">Page {result.page} of {totalPages || 1}</span> : null}
          </div>

          {"error" in parsed && !loadFailed ? (
            <div role="alert" className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-700 dark:text-amber-300">
              {parsed.error}
            </div>
          ) : null}
          {loadFailed ? <ServiceDataError /> : null}

          {result && result.services.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {result.services.map((service) => <ServiceCard key={service.id} service={service} />)}
              </div>

              {totalPages > 1 ? (
                <nav aria-label="Service pages" className="flex items-center justify-center gap-3 pt-4">
                  {result.page > 1 ? (
                    <Link href={buildServicesUrl(params!, result.page - 1)}>
                      <Button variant="outline" className="rounded-full">Previous</Button>
                    </Link>
                  ) : null}
                  <span className="text-sm text-muted-foreground">Page {result.page} of {totalPages}</span>
                  {result.page < totalPages ? (
                    <Link href={buildServicesUrl(params!, result.page + 1)}>
                      <Button variant="outline" className="rounded-full">Next</Button>
                    </Link>
                  ) : null}
                </nav>
              ) : null}
            </>
          ) : null}

          {result && result.services.length === 0 ? (
            <div className="rounded-[24px] border border-border bg-card/80 px-6 py-12 text-center">
              <h3 className="text-xl font-semibold text-foreground">No matching services</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try a different search or remove one of your filters.</p>
              <Link href="/services" className="mt-5 inline-flex">
                <Button variant="outline" className="rounded-full">Show all services</Button>
              </Link>
            </div>
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
