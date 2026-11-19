import { Badge } from "@/components/ui/badge";
import { BookingActions } from "@/components/booking-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  bookingStatusBadge,
  bookingStatusLabels,
  formatFinalAmount,
  formatPreferredDate,
  isPaymentStatus,
  paymentStatusBadge,
  paymentStatusLabels,
  shortBookingId,
  type BookingRecord,
} from "@/lib/bookings";

const headers = [
  "Booking",
  "Customer",
  "Service",
  "Technician",
  "Preferred date",
  "Status",
  "Final amount",
  "Actions",
];

function StatusCell({ status }: { status: BookingRecord["status"] }) {
  return (
    <Badge variant="outline" className={`rounded-full capitalize ${bookingStatusBadge(status)}`}>
      {bookingStatusLabels[status]}
    </Badge>
  );
}

function PaymentCell({ booking }: { booking: BookingRecord }) {
  const payment = isPaymentStatus(booking.paymentStatus) ? booking.paymentStatus : "unpaid";
  return (
    <Badge variant="outline" className={`rounded-full ${paymentStatusBadge(payment)}`}>
      {paymentStatusLabels[payment]}
    </Badge>
  );
}

function AdminRow({ booking }: { booking: BookingRecord }) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{shortBookingId(booking.id)}</TableCell>
      <TableCell>
        <div>{booking.customerName || "Customer"}</div>
        <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
      </TableCell>
      <TableCell className="font-medium">{booking.serviceTitle}</TableCell>
      <TableCell>
        <div>{booking.technicianName || "—"}</div>
        <div className="text-xs text-muted-foreground">{booking.technicianEmail}</div>
      </TableCell>
      <TableCell>{formatPreferredDate(booking.preferredDate)}</TableCell>
      <TableCell>
        <div className="flex flex-col items-start gap-1">
          <StatusCell status={booking.status} />
          <PaymentCell booking={booking} />
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">{formatFinalAmount(booking.finalAmount)}</TableCell>
      <TableCell>
        <BookingActions booking={booking} scope="admin" />
      </TableCell>
    </TableRow>
  );
}

export function BookingsTable({ bookings }: { bookings: BookingRecord[] }) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/80 p-6 text-sm text-muted-foreground">
        No booking records to show yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card/80">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <AdminRow key={booking.id} booking={booking} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
