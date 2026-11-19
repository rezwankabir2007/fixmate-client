import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Search,
  Sparkles,
} from "lucide-react";
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
  getServicesResponse,
  type Service,
} from "@/app/api/services";

type SearchParams = Record<string, string | string[] | undefined>;

type ParsedFilters = {
  q: string;
  category: string;
  serviceMode: string;
  sort: string;
  page: number;
  limit: number;
};

function parseFilters(raw: SearchParams): ParsedFilters {
  const single = (key: string) => {
    const val = raw[key];
    return typeof val === "string" ? val.trim() : "";
  };

  const q = single("q").slice(0, 100);
  const category = single("category");
  const serviceMode = single("serviceMode").slice(0, 60);
  const sortRaw = single("sort");
  const sort = ["newest", "price-asc", "price-desc"].includes(sortRaw)
    ? sortRaw
    : "newest";

  const pageNum = Number(single("page") || "1");
  const limitNum = Number(single("limit") || "6");

  return {
    q,
    category,
    serviceMode,
    sort,
    page: Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1,
    limit:
      Number.isInteger(limitNum) && limitNum >= 1 && limitNum <= 24
        ? limitNum
        : 6,
  };
}

function buildServicesHref(filters: ParsedFilters, overridePage?: number) {
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  if (filters.category) query.set("category", filters.category);
  if (filters.serviceMode) query.set("serviceMode", filters.serviceMode);
  if (filters.sort !== "newest") query.set("sort", filters.sort);
  if (filters.limit !== 6) query.set("limit", String(filters.limit));
  query.set("page", String(overridePage ?? filters.page));
  return `/services?${query.toString()}`;
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group flex h-full flex-col justify-between overflow-hidden border-border bg-card/80 shadow-[0_20px_45px_rgba(23,36,59,0.06)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(23,36,59,0.12)]">
      <div>
        <div className="overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardHeader className="px-5 pt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-blue-700 dark:text-blue-200">
              {service.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 className="size-3" />
              Available
            </span>
          </div>
          <CardTitle className="line-clamp-1 text-xl">{service.title}</CardTitle>
          <CardDescription className="mt-2 line-clamp-2 text-sm leading-6">
            {service.shortDescription || service.description}
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="space-y-4 px-5 pb-5">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-4 text-blue-600" />
            {service.duration}
          </span>
          <span className="text-lg font-semibold text-foreground">
            ${service.price}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          {service.serviceMode ? (
            <span>Service mode: {service.serviceMode}</span>
          ) : (
            <span />
          )}
          {service.technicianName ? <span>{service.technicianName}</span> : null}
        </div>

        <Link
          href={`/services/${encodeURIComponent(service.id)}`}
          className="block"
        >
          <Button className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white">
            More details
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ServicesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-96 animate-pulse rounded-2xl border border-border bg-card/60 p-5"
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

async function ServicesCatalog({ filters }: { filters: ParsedFilters }) {
  let responseData;
  try {
    responseData = await getServicesResponse({
      q: filters.q,
      category: filters.category,
      serviceMode: filters.serviceMode,
      sort: filters.sort,
      page: filters.page,
      limit: filters.limit,
    });
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return (
      <div
        role="alert"
        className="rounded-[24px] border border-red-500/20 bg-red-500/5 p-6 text-center"
      >
        <h2 className="text-xl font-semibold text-foreground">
          Services are temporarily unavailable
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t load the service catalog. Please try again in a
          moment.
        </p>
        <Link href="/services" className="mt-4 inline-flex">
          <Button variant="outline" className="rounded-full">
            Try again
          </Button>
        </Link>
      </div>
    );
  }

  const { data: services, pagination } = responseData;
  const totalPages = Math.max(1, pagination.totalPages || 1);

  if (services.length === 0) {
    return (
      <div className="rounded-[24px] border border-border bg-card/80 px-6 py-12 text-center">
        <h3 className="text-xl font-semibold text-foreground">
          No matching services
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try a different search or remove one of your filters.
        </p>
        <Link href="/services" className="mt-5 inline-flex">
          <Button variant="outline" className="rounded-full">
            Show all services
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          {pagination.total} approved and available{" "}
          {pagination.total === 1 ? "service" : "services"}
        </span>
        <span>
          Page {pagination.page} of {totalPages}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Service pages"
          className="flex items-center justify-center gap-3 pt-4"
        >
          {pagination.page > 1 ? (
            <Link href={buildServicesHref(filters, pagination.page - 1)}>
              <Button variant="outline" className="rounded-full">
                Previous
              </Button>
            </Link>
          ) : null}

          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {totalPages}
          </span>

          {pagination.page < totalPages ? (
            <Link href={buildServicesHref(filters, pagination.page + 1)}>
              <Button variant="outline" className="rounded-full">
                Next
              </Button>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const rawSearchParams = await searchParams;
  const filters = parseFilters(rawSearchParams);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.12),rgba(54,185,154,0.08),transparent)] p-6 shadow-[0_25px_70px_rgba(23,36,59,0.08)] sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
            FixMate services
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
            Find the right repair for the things you rely on.
          </h1>
        </section>

        <section aria-label="Browse service categories" className="mt-8">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
            {serviceCategories.map((category) => (
              <Link
                key={category}
                href={buildServicesHref({ ...filters, category }, 1)}
                className={`rounded-2xl border p-4 text-sm font-medium transition-colors hover:border-blue-500/40 hover:bg-blue-500/5 ${
                  filters.category === category
                    ? "border-blue-500/40 bg-blue-500/5 text-blue-700 dark:text-blue-200"
                    : "border-border bg-card/80 text-foreground"
                }`}
              >
                <Sparkles className="mb-3 size-4 text-blue-600 dark:text-blue-300" />
                {category}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[24px] border border-border bg-card/80 p-5 shadow-[0_18px_40px_rgba(23,36,59,0.05)]">
          <form
            key={`${filters.q}-${filters.category}-${filters.serviceMode}-${filters.sort}`}
            action="/services"
            method="get"
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(150px,1fr))_auto] xl:items-end"
          >
            <div className="space-y-2">
              <label htmlFor="q" className="text-sm font-medium text-foreground">
                Search title or category
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="q"
                  name="q"
                  defaultValue={filters.q}
                  maxLength={100}
                  placeholder="e.g. laptop or AC"
                  className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-foreground"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={filters.category}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">All categories</option>
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="serviceMode"
                className="text-sm font-medium text-foreground"
              >
                Service mode
              </label>
              <select
                id="serviceMode"
                name="serviceMode"
                defaultValue={filters.serviceMode}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="">All modes</option>
                <option value="Home Visit">Home Visit</option>
                <option value="Shop Drop-off">Shop Drop-off</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-foreground"
              >
                Sort by
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={filters.sort}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Lowest price</option>
                <option value="price-desc">Highest price</option>
              </select>
            </div>

            <input type="hidden" name="page" value="1" />
            <input type="hidden" name="limit" value={filters.limit} />

            <div className="flex gap-2">
              <Button
                type="submit"
                className="w-full rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white xl:w-auto"
              >
                Apply filters
              </Button>
              <Link href="/services">
                <Button type="button" variant="outline" className="rounded-full">
                  Clear
                </Button>
              </Link>
            </div>
          </form>
        </section>

        <section className="mt-10 space-y-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
              Repair catalog
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
              {filters.category
                ? `${filters.category} services`
                : "Available services"}
            </h2>
          </div>

          <Suspense
            key={`${filters.q}-${filters.category}-${filters.serviceMode}-${filters.sort}-${filters.page}-${filters.limit}`}
            fallback={<ServicesSkeleton />}
          >
            <ServicesCatalog filters={filters} />
          </Suspense>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}