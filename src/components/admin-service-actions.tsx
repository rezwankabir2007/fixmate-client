"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminServiceActions({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function moderate(status: "approved" | "rejected") {
    setPending(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/services/${encodeURIComponent(serviceId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "The service could not be updated.");
      }

      router.refresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "The service could not be updated.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button type="button" size="sm" disabled={pending} onClick={() => moderate("approved")}>
          Approve
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => moderate("rejected")}>
          Reject
        </Button>
      </div>
      {error ? <span role="alert" className="max-w-48 text-xs text-red-600 dark:text-red-300">{error}</span> : null}
    </div>
  );
}
