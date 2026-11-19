"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Inbox,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { BookingActions } from "@/components/booking-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  bookingStatusBadge,
  bookingStatusLabels,
  formatBookingDate,
  formatFinalAmount,
  formatMoney,
  formatPreferredDate,
  isPaymentStatus,
  paymentStatusBadge,
  paymentStatusLabels,
  type BookingRecord,
  type BookingStatus,
} from "@/lib/bookings";

type FilterKey = "all" | BookingStatus;

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

function StatusBadges({ booking }: { booking: BookingRecord }) {
  const payment = isPaymentStatus(booking.paymentStatus) ? booking.paymentStatus : "unpaid";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline" className={`rounded-full ${bookingStatusBadge(booking.status)}`}>
        {bookingStatusLabels[booking.status]}
      </Badge>
      <Badge variant="outline" className={`rounded-full ${paymentStatusBadge(payment)}`}>
        {paymentStatusLabels[payment]}
      </Badge>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300">
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function RequestCard({ booking }: { booking: BookingRecord }) {
  return (
    <Card className="overflow-hidden border-border bg-card/80 shadow-[0_18px_40px_rgba(23,36,59,0.06)]">
      <div className="grid gap-0 sm:grid-cols-[140px_minmax(0,1fr)]">
        <div className="relative h-32 w-full sm:h-full">
          {booking.serviceImage ? (
            <Image
              src={booking.serviceImage}
              alt={booking.serviceTitle}
              fill
              sizes="(max-width: 640px) 100vw, 140px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <ClipboardList className="size-6" />
            </div>
          )}
        </div>

        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {booking.category ? (
                  <Badge className="rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-200">
                    {booking.category}
                  </Badge>
                ) : null}
                <span className="text-xs text-muted-foreground">
                  #{booking.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold leading-6 text-foreground">
                {booking.serviceTitle}
              </h3>
            </div>
            <StatusBadges booking={booking} />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Detail icon={UserRound} label="Customer" value={booking.customerName} />
            <Detail icon={Phone} label="Phone" value={booking.customerPhone || "—"} />
            <Detail icon={MapPin} label="Address" value={booking.address || "—"} />
            <Detail
              icon={CalendarDays}
              label="Preferred date"
              value={formatPreferredDate(booking.preferredDate)}
            />
          </div>

          {booking.problemDescription ? (
            <p className="mt-4 rounded-xl border border-border bg-muted/40 p-3 text-sm leading-6 text-muted-foreground">
              <span className="font-medium text-foreground">Problem: </span>
              {booking.problemDescription}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
            <div>
              <span className="text-muted-foreground">Base price: </span>
              <span className="font-semibold text-foreground">{formatMoney(booking.basePrice)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Final amount: </span>
              <span
                className={
                  booking.finalAmount === null
                    ? "text-muted-foreground"
                    : "font-semibold text-foreground"
                }
              >
                {formatFinalAmount(booking.finalAmount)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Requested on: </span>
              <span className="text-foreground">{formatBookingDate(booking.createdAt)}</span>
            </div>
          </div>

          <div className="mt-4">
            <BookingActions booking={booking} scope="technician" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function TechnicianRequestsBoard({ bookings }: { bookings: BookingRecord[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const visible = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((option) => {
          const count =
            option.key === "all"
              ? bookings.length
              : bookings.filter((booking) => booking.status === option.key).length;
          const active = filter === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-border bg-card/80 text-muted-foreground hover:border-blue-500/40 hover:text-foreground"
              }`}
            >
              {option.label}
              <span className={active ? "ml-1.5 text-blue-100" : "ml-1.5 text-muted-foreground/70"}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <Card className="border-border bg-card/80">
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Inbox className="size-5" />
            </span>
            <p className="mt-4 font-semibold text-foreground">
              {filter === "all" ? "No requests yet" : `No ${bookingStatusLabels[filter as BookingStatus].toLowerCase()} requests`}
            </p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {filter === "all"
                ? "When customers request one of your services, the request appears here for you to accept and complete."
                : "Switch filters to see your other requests."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5">
          {visible.map((booking) => (
            <RequestCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
