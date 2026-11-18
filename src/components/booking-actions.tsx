"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  bookingStatusLabels,
  type BookingRecord,
  type BookingScope,
  type BookingStatus,
} from "@/lib/bookings";

type PendingAction = {
  label: string;
  next: BookingStatus;
  variant: "default" | "outline" | "destructive";
};

// Mirrors the backend transition matrix (models/booking.model.js).
function actionsFor(scope: BookingScope, status: BookingStatus): PendingAction[] {
  if (scope === "admin") {
    const actions: PendingAction[] = [];
    if (status !== "cancelled") {
      actions.push({ label: "Cancel", next: "cancelled", variant: "outline" });
    }
    if (status !== "completed") {
      actions.push({ label: "Complete", next: "completed", variant: "default" });
    }
    return actions;
  }

  if (scope === "customer") {
    if (status === "pending" || status === "accepted") {
      return [{ label: "Cancel booking", next: "cancelled", variant: "outline" }];
    }
    return [];
  }

  // technician
  if (status === "pending") {
    return [
      { label: "Accept", next: "accepted", variant: "default" },
      { label: "Decline", next: "declined", variant: "outline" },
    ];
  }
  if (status === "accepted") {
    return [{ label: "Mark completed", next: "completed", variant: "default" }];
  }
  return [];
}

export function BookingActions({
  booking,
  scope,
}: {
  booking: BookingRecord;
  scope: BookingScope;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const actions = actionsFor(scope, booking.status);
  if (actions.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  const handleAction = async (action: PendingAction) => {
    setBusy(true);
    try {
      const response = await fetch(
        `/api/bookings/${encodeURIComponent(booking.id)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action.next }),
        },
      );

      if (!response.ok) {
        let message = "The booking could not be updated.";
        try {
          const data = await response.json();
          if (data && typeof data.error === "string" && data.error.trim()) {
            message = data.error;
          }
        } catch {
          // Keep the default message when the response is not JSON.
        }
        toast.error(message);
        return;
      }

      toast.success(`Booking marked as ${bookingStatusLabels[action.next].toLowerCase()}.`);
      router.refresh();
    } catch {
      toast.error(
        "The booking could not be updated. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.next}
          type="button"
          size="sm"
          variant={action.variant}
          disabled={busy}
          onClick={() => handleAction(action)}
          className="rounded-full"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
