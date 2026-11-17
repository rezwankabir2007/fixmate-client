"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center px-4 py-12">
      <div role="alert" className="w-full rounded-[28px] border border-red-500/20 bg-red-500/5 p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard unavailable</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t verify your session or load this workspace. Your access has not been granted.
        </p>
        <Button type="button" onClick={reset} variant="outline" className="mt-6 rounded-full">
          Try again
        </Button>
      </div>
    </main>
  );
}
