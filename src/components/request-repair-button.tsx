"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, CheckCircle2, Loader2, LockKeyhole, Send } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient, type AuthSessionUser } from "@/lib/auth-client";
import { fetchWithJwt } from "@/lib/fetch-with-jwt";

type FieldErrors = Partial<
  Record<"customerPhone" | "address" | "preferredDate" | "problemDescription", string>
>;

function localTodayIso(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function validateFields(values: {
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  const phone = values.customerPhone.trim();
  const digits = phone.replace(/\D/g, "");
  if (!phone) {
    errors.customerPhone = "Phone number is required.";
  } else if (!/^\+?[\d\s\-().]+$/.test(phone) || digits.length < 7 || phone.length > 20) {
    errors.customerPhone = "Enter a valid phone number.";
  }

  const address = values.address.trim();
  if (!address) {
    errors.address = "Address is required.";
  } else if (address.length < 5 || address.length > 300) {
    errors.address = "Address must be between 5 and 300 characters.";
  }

  if (!values.preferredDate) {
    errors.preferredDate = "Preferred date is required.";
  } else if (values.preferredDate < localTodayIso()) {
    errors.preferredDate = "Choose today or a future date.";
  }

  const problem = values.problemDescription.trim();
  if (!problem) {
    errors.problemDescription = "Problem description is required.";
  } else if (problem.length < 20) {
    errors.problemDescription = "Describe the problem in at least 20 characters.";
  }

  return errors;
}

async function messageFromResponse(response: Response, fallback: string): Promise<string> {
  try {
    const payload = await response.json();
    if (payload && typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
    if (payload && typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  } catch {
    // Non-JSON response keeps the fallback message.
  }
  return fallback;
}

/**
 * Role-aware "Request Repair" call to action for the public service page:
 *  - Signed out  → redirects to /sign-in and returns to this page afterwards.
 *  - Technician / admin → disabled with "Only customers can request a repair."
 *  - Customer    → opens the repair request form dialog.
 */
export function RequestRepairButton({ serviceId, serviceTitle }: { serviceId: string; serviceTitle: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  const sessionUser = session?.user as AuthSessionUser | undefined;
  const role = sessionUser?.role;
  const today = useMemo(() => localTodayIso(), []);

  function handleSignInRedirect() {
    const redirect = `${pathname}`;
    router.push(`/sign-in?redirect=${encodeURIComponent(redirect)}`);
  }

  function openForm() {
    setFormError("");
    setErrors({});
    // Reopening after a submission returns to a fresh form view (values the
    // user already typed are kept).
    setSubmitted(false);
    setOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = { customerPhone, address, preferredDate, problemDescription };
    const nextErrors = validateFields(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetchWithJwt("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          customerPhone: customerPhone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });

      if (!response.ok) {
        const message = await messageFromResponse(
          response,
          "Your repair request could not be submitted.",
        );
        setFormError(message);
        toast.error(message);
        return;
      }

      setSubmitted(true);
      // Clear the fields so the next request starts fresh.
      setCustomerPhone("");
      setAddress("");
      setPreferredDate("");
      setProblemDescription("");
      toast.success("Repair request submitted successfully.");
    } catch {
      const message = "Your repair request could not be submitted. Check your connection and try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (isPending) {
    return (
      <Button
        type="button"
        disabled
        className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20"
      >
        <Loader2 className="size-4 animate-spin" />
        Request Repair
      </Button>
    );
  }

  // Technician / admin accounts may never create repair requests.
  if (sessionUser && role !== "customer") {
    return (
      <div className="flex flex-col items-start gap-2">
        <Button
          type="button"
          disabled
          className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20"
        >
          <LockKeyhole className="size-4" />
          Request Repair
        </Button>
        <p className="text-sm text-muted-foreground">Only customers can request a repair.</p>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <Button
        type="button"
        onClick={handleSignInRedirect}
        className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20"
      >
        <LockKeyhole className="size-4" />
        Request Repair
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        onClick={openForm}
        className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white shadow-lg shadow-blue-500/20"
      >
        <Send className="size-4" />
        Request Repair
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          {submitted ? (
            <div className="space-y-4 py-2 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 className="size-6" />
              </span>
              <DialogTitle className="text-lg">Repair request submitted</DialogTitle>
              <DialogDescription>
                Your request for <span className="font-medium text-foreground">{serviceTitle}</span> was
                sent to the assigned technician. Track its progress from My Bookings.
              </DialogDescription>
              <DialogFooter className="sm:justify-center">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button
                  type="button"
                  className="rounded-full bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white"
                  onClick={() => {
                    setOpen(false);
                    router.push("/dashboard/customer/bookings");
                  }}
                >
                  View My Bookings
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <DialogHeader>
                <DialogTitle>Request a repair</DialogTitle>
                <DialogDescription>
                  {serviceTitle} — a technician will review your request.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="repair-customer-name">Customer name</Label>
                    <Input
                      id="repair-customer-name"
                      value={sessionUser.name ?? ""}
                      readOnly
                      disabled
                      className="bg-muted/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repair-customer-email">Customer email</Label>
                    <Input
                      id="repair-customer-email"
                      value={sessionUser.email ?? ""}
                      readOnly
                      disabled
                      className="bg-muted/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repair-phone">Phone number *</Label>
                  <Input
                    id="repair-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. +1 555 123 4567"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    aria-invalid={Boolean(errors.customerPhone)}
                    disabled={submitting}
                    required
                  />
                  {errors.customerPhone ? (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.customerPhone}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repair-address">Address *</Label>
                  <Input
                    id="repair-address"
                    autoComplete="street-address"
                    placeholder="House, street, area, city"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    aria-invalid={Boolean(errors.address)}
                    disabled={submitting}
                    required
                  />
                  {errors.address ? (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.address}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repair-date" className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    Preferred date *
                  </Label>
                  <Input
                    id="repair-date"
                    type="date"
                    min={today}
                    value={preferredDate}
                    onChange={(event) => setPreferredDate(event.target.value)}
                    aria-invalid={Boolean(errors.preferredDate)}
                    disabled={submitting}
                    required
                  />
                  {errors.preferredDate ? (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.preferredDate}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repair-problem">Problem description *</Label>
                  <Textarea
                    id="repair-problem"
                    rows={4}
                    maxLength={2000}
                    placeholder="Describe the issue, when it started, and any error messages (min. 20 characters)."
                    value={problemDescription}
                    onChange={(event) => setProblemDescription(event.target.value)}
                    aria-invalid={Boolean(errors.problemDescription)}
                    disabled={submitting}
                    required
                  />
                  <div className="flex items-start justify-between gap-2">
                    {errors.problemDescription ? (
                      <p className="text-xs text-red-600 dark:text-red-400">{errors.problemDescription}</p>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-muted-foreground">{problemDescription.trim().length}/20 min</span>
                  </div>
                </div>

                {formError ? (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400"
                  >
                    {formError}
                  </p>
                ) : null}
              </div>

              <DialogFooter className="mt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[linear-gradient(135deg,#17243B_0%,#3478F6_100%)] text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Submit request
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
