import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";

export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main aria-label="Loading services" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-52 animate-pulse rounded-[32px] bg-muted" />
        <div className="mt-8 h-24 animate-pulse rounded-[24px] bg-muted" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} className="h-80 animate-pulse border-border bg-muted/60" />
          ))}
        </div>
      </main>
    </div>
  );
}
