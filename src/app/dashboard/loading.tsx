import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <main aria-label="Loading dashboard" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-20 animate-pulse rounded-[28px] bg-muted" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <div className="h-64 animate-pulse rounded-[24px] bg-muted" />
        <div>
          <div className="h-20 animate-pulse rounded-2xl bg-muted" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Card key={index} className="h-32 animate-pulse border-border bg-muted/60" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
