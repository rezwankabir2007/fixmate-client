
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertTriangle,
  Check,
  CreditCard,
  Play,
  X,
} from "lucide-react";

import {
  canTransition,
  formatMoney,
  getStatusBadgeClass,
  getStatusLabel,
  getTransitionLabel,
  type BookingRecord,
  type BookingStatus,
} from "@/lib/bookings";

import {
  patchBookingStatus,
  createCheckoutSession,
} from "@/lib/booking-api";

type Actor = "customer" | "technician" | "admin";

function ActionButton({
  label,
  icon,
  tone,
  disabled,
  pending,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  tone: "accept" | "reject" | "start" | "complete" | "cancel" | "pay";
  disabled?: boolean;
  pending?: boolean;
  onClick: () => void;
}) {
  const toneClasses = {
    accept: "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    reject: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
    start: "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100",
    complete: "border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100",
    cancel: "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100",
    pay: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || pending}
      onClick={onClick}
      className={toneClasses[tone]}
    >
      {icon}
      {pending ? "Working..." : label}
    </Button>
  );
}

export function BookingActions({
  booking,
  scope,
}: {
  booking: BookingRecord;
  scope: Actor;
}) {
  const router = useRouter();

  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [finalAmountDialog, setFinalAmountDialog] = useState(false);

  const busy = pendingAction !== null;

  async function applyTransition(
    next: BookingStatus,
    actionKey: string,
    finalAmount?: number,
  ) {
    setPendingAction(actionKey);
    setError(null);

    try {
      await patchBookingStatus(booking._id ?? booking.id, {
        status: next,
        ...(finalAmount !== undefined ? { finalAmount } : {}),
      });

      setConfirmCancel(false);
      setFinalAmountDialog(false);

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update the request.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handlePayment() {
    setPendingAction("pay");
    setError(null);

    try {
      const checkoutUrl = await createCheckoutSession(
        booking._id ?? booking.id,
      );

      window.location.assign(checkoutUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not start the payment. Please try again.",
      );

      setPendingAction(null);
    }
  }

  function runTransition(
    next: BookingStatus,
    actionKey: string,
    finalAmount?: number,
  ) {
    if (!canTransition(booking.status, next, scope)) {
      setError(
        `This request can no longer move from ${getStatusLabel(booking.status)}.`,
      );
      return;
    }

    void applyTransition(next, actionKey, finalAmount);
  }

  if (scope === "admin") {
    return (
      <p className="text-xs text-slate-500">
        View only. Only the assigned technician or the customer can change
        this request.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Could not update the request</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {scope === "technician" && booking.status === "requested" ? (
          <>
            <ActionButton
              label={getTransitionLabel(booking.status, "accepted")}
              icon={<Check className="h-4 w-4" />}
              tone="accept"
              pending={pendingAction === "accept"}
              disabled={busy}
              onClick={() => runTransition("accepted", "accept")}
            />

            <ActionButton
              label={getTransitionLabel(booking.status, "rejected")}
              icon={<X className="h-4 w-4" />}
              tone="reject"
              pending={pendingAction === "reject"}
              disabled={busy}
              onClick={() => runTransition("rejected", "reject")}
            />
          </>
        ) : null}

        {scope === "technician" && booking.status === "accepted" ? (
          <ActionButton
            label={getTransitionLabel(booking.status, "in-progress")}
            icon={<Play className="h-4 w-4" />}
            tone="start"
            pending={pendingAction === "start"}
            disabled={busy}
            onClick={() => runTransition("in-progress", "start")}
          />
        ) : null}

        {scope === "technician" && booking.status === "in-progress" ? (
          <ActionButton
            label="Mark Completed"
            icon={<Check className="h-4 w-4" />}
            tone="complete"
            pending={pendingAction === "complete"}
            disabled={busy}
            onClick={() => setFinalAmountDialog(true)}
          />
        ) : null}

        {scope === "customer" && booking.status === "requested" ? (
          <ActionButton
            label="Cancel Request"
            icon={<X className="h-4 w-4" />}
            tone="cancel"
            pending={pendingAction === "cancel"}
            disabled={busy}
            onClick={() => setConfirmCancel(true)}
          />
        ) : null}

        {scope === "customer" &&
        booking.status === "completed" &&
        booking.paymentStatus === "unpaid" ? (
          <ActionButton
            label={`Pay Now${
              booking.finalAmount
                ? ` (${formatMoney(booking.finalAmount)})`
                : ""
            }`}
            icon={<CreditCard className="h-4 w-4" />}
            tone="pay"
            pending={pendingAction === "pay"}
            disabled={busy}
            onClick={() => void handlePayment()}
          />
        ) : null}

        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(booking.status)}`}
        >
          {getStatusLabel(booking.status)}
        </span>
      </div>

      <CancelDialog
        open={confirmCancel}
        busy={pendingAction === "cancel"}
        onOpenChange={setConfirmCancel}
        onConfirm={() => runTransition("cancelled", "cancel")}
      />

      <FinalAmountDialog
        open={finalAmountDialog}
        booking={booking}
        busy={pendingAction === "complete"}
        onOpenChange={setFinalAmountDialog}
        onConfirm={(amount) =>
          runTransition("completed", "complete", amount)
        }
      />
    </div>
  );
}

function CancelDialog({
  open,
  busy,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel this repair request?</DialogTitle>
          <DialogDescription>
            This withdraws your request. The technician will no longer see it
            as active, and you can request the service again later.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Keep Request
          </Button>

          <Button type="button" onClick={onConfirm} disabled={busy}>
            {busy ? "Cancelling..." : "Yes, Cancel Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FinalAmountDialog({
  open,
  booking,
  busy,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  booking: BookingRecord;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (amount: number) => void;
}) {
  const [value, setValue] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const prefill = booking.basePrice ?? 0;
  const raw = value.trim() === "" ? String(prefill) : value;
  const parsed = Number(raw);

  const invalid = !Number.isFinite(parsed) || parsed <= 0;
  const showError = touched && invalid;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next && value.trim() === "") {
          setValue(String(prefill));
        }

        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm final amount</DialogTitle>
          <DialogDescription>
            Review the base price and set the final amount for this completed
            repair.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Base price</span>
              <span className="font-semibold text-slate-900">
                {formatMoney(booking.basePrice)}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {booking.serviceTitle} &middot; {booking.customerName}
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="final-amount"
              className="text-sm font-medium text-slate-700"
            >
              Final amount (USD)
            </label>

            <input
              id="final-amount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              value={value.trim() === "" ? String(prefill) : value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setTouched(true)}
              autoFocus
            />

            {showError ? (
              <p className="text-sm text-red-600">
                Enter an amount greater than 0.
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                The customer will see this amount as the final price.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Back
          </Button>

          <Button
            type="button"
            disabled={busy}
            onClick={() => {
              setTouched(true);
              if (invalid) return;
              onConfirm(parsed);
            }}
          >
            {busy ? "Saving..." : "Confirm completion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
