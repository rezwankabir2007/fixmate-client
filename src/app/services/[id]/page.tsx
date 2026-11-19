
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RequestRepairButton } from "@/components/request-repair-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getServiceById,
  getServicesResponse,
  type Service,
} from "@/app/api/services";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function loadRelatedServices(service: Service): Promise<Service[]> {
  try {
    const response = await getServicesResponse({
      category: service.category,
      limit: 6,
    });

    return response.data
      .filter((item) => item.id !== service.id)
      .slice(0, 3);
  } catch (error) {
    console.error(
      `Failed to load related services for "${service.id}".`,
      error
    );
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await connection();
  const { id } = await params;

  try {
    const service = await getServiceById(id);

    if (!service) {
      return { title: "Service not found | FixMate" };
    }

    return {
      title: `${service.title} | FixMate`,
      description: service.shortDescription,
    };
  } catch (error) {
    console.error(`Failed to load metadata for service "${id}".`, error);
    return { title: "Service details | FixMate" };
  }
}

export default async function ServiceDetailPage({
  params,
}: PageProps) {
  await connection();
  const { id } = await params;

  let service: Service | null = null;
  let relatedServices: Service[] = [];

  try {
    service = await getServiceById(id);

    if (service) {
      relatedServices = await loadRelatedServices(service);
    }
  } catch (error) {
    console.error(`Failed to load service details for "${id}".`, error);

    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div
            role="alert"
            className="rounded-[28px] border border-red-500/20 bg-red-500/5 p-8 text-center"
          >
            <h1 className="text-2xl font-semibold text-foreground">
              Service details are temporarily unavailable
            </h1>

            <p className="mt-3 text-muted-foreground">
              Please try again in a moment or browse the full service catalog.
            </p>

            <Link href="/services" className="mt-6 inline-flex">
              <Button variant="outline" className="rounded-full">
                Back to services
              </Button>
            </Link>
          </div>
        </main>

        <SiteFooter />
      </div>
    );
  }

  if (!service) {
    notFound();
  }

  const technicianName = service.technicianName?.trim() || "";
  const technicianArea =
    service.technicianArea?.trim() ||
    service.serviceArea?.trim() ||
    "";
  const technicianBio = service.technicianBio?.trim() || "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to services
        </Link>

        {/* Service hero */}
        <section className="mt-6 overflow-hidden rounded-[32px] border border-border bg-card/80 shadow-[0_25px_70px_rgba(23,36,59,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden">
              <Image
                src={service.image || "/placeholder-service.jpg"}
                alt={service.title}
                width={800}
                height={560}
                className="h-full min-h-[320px] w-full object-cover"
                unoptimized
              />

              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Approved &amp; available
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-200">
                  {service.category}
                </Badge>

                {service.serviceMode ? (
                  <Badge variant="outline" className="rounded-full">
                    {service.serviceMode}
                  </Badge>
                ) : null}
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-foreground">
                {service.title}
              </h1>

              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                {service.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2">
                  <Clock3 className="size-4 text-blue-600" />
                  {service.duration}
                </span>

                {service.serviceArea ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2">
                    <MapPin className="size-4 text-emerald-600" />
                    {service.serviceArea}
                  </span>
                ) : null}
              </div>

              {/* Starting price */}
              <div className="mt-6 rounded-[24px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.08),rgba(54,185,154,0.06),transparent)] p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  Starting from
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-foreground">
                    ${service.price}
                  </span>

                  <span className="pb-1 text-sm text-muted-foreground">
                    one-time fee
                  </span>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Final amount is confirmed by your technician after the work is completed.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <RequestRepairButton
                  serviceId={service.id}
                  serviceTitle={service.title}
                />

                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Free cancellation before acceptance
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Description and technician information */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.05)]">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-2xl">
                About this service
              </CardTitle>
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

          <div className="space-y-6">
            {/* Service details */}
            <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.05)]">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-2xl">
                  Service details
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 px-6 pb-6">
                {[
                  {
                    label: "Estimated duration",
                    value: service.duration,
                  },
                  {
                    label: "Service mode",
                    value: service.serviceMode || "Not specified",
                  },
                  {
                    label: "Service area",
                    value: service.serviceArea || "Not specified",
                  },
                  {
                    label: "Category",
                    value: service.category,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/40 p-3"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>

                    <span className="text-right text-sm font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Assigned technician */}
            <Card className="border-border bg-card/80 shadow-[0_20px_50px_rgba(23,36,59,0.05)]">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <UserRound className="size-5 text-blue-600" />
                  Assigned technician
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <div className="flex items-start gap-4">
                  <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-muted-foreground">
                    {service.technicianImage ? (
                      <Image
                        src={service.technicianImage}
                        alt={technicianName || "Technician"}
                        width={56}
                        height={56}
                        className="size-14 object-cover"
                      />
                    ) : (
                      <Wrench className="size-6" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      {technicianName || "FixMate technician"}
                    </p>

                    {technicianArea ? (
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {technicianArea}
                      </p>
                    ) : null}

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {technicianBio ||
                        "Your request is assigned to a vetted FixMate professional who will confirm timing and the final quote."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Bottom Book Now CTA */}
        <section className="mt-10 rounded-[28px] border border-border bg-[linear-gradient(135deg,rgba(52,120,246,0.08),rgba(54,185,154,0.06),transparent)] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Ready to schedule {service.title}?
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Starting from{" "}
                <span className="font-semibold text-foreground">
                  ${service.price}
                </span>{" "}
                • Free cancellation before technician acceptance.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <RequestRepairButton
                serviceId={service.id}
                serviceTitle={service.title}
              />
            </div>
          </div>
        </section>

        {/* Related services */}
        <section className="mt-12 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
              More services
            </h2>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore all
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {relatedServices.length === 0 ? (
            <p className="rounded-2xl border border-border bg-card/80 p-5 text-sm text-muted-foreground">
              No other services are available in this category right now.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {relatedServices.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-border bg-card/80 shadow-[0_18px_35px_rgba(23,36,59,0.06)]"
                >
                  <div className="overflow-hidden">
                    <Image
                      src={item.image || "/placeholder-service.jpg"}
                      alt={item.title}
                      width={500}
                      height={300}
                      className="h-40 w-full object-cover"
                      unoptimized
                    />
                  </div>

                  <CardHeader className="px-5 pt-5">
                    <Badge className="w-fit rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-200">
                      {item.category}
                    </Badge>

                    <CardTitle className="mt-3 text-xl">
                      {item.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-5 pb-5">
                    <Link href={`/services/${item.id}`}>
                      <Button
                        variant="outline"
                        className="w-full rounded-full"
                      >
                        View service
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
