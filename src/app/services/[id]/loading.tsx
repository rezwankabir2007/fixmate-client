import { SiteHeader } from "@/components/site-header";

export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main aria-label="Loading service details" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded-full bg-muted" />
        <div className="mt-6 grid animate-pulse overflow-hidden rounded-[32px] border border-border bg-muted/60 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-[320px] bg-muted" />
          <div className="space-y-5 p-8">
            <div className="h-8 w-36 rounded-full bg-background/70" />
            <div className="h-12 w-4/5 rounded-xl bg-background/70" />
            <div className="h-24 rounded-xl bg-background/70" />
          </div>
        </div>
      </main>
    </div>
  );
}
