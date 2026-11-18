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
  formatSchedule,
  shortBookingId,
  type BookingRecord,
  type BookingScope,
} from "@/lib/bookings";

const headersByScope: Record<BookingScope, string[]> = {
  customer: ["Booking", "Service", "Technician", "Schedule", "Status", "Actions"],
  technician: ["Request", "Service", "Customer", "Scheduled time", "Status", "Actions"],
  admin: [
    "Booking",
    "Customer",
    "Service",
    "Technician",
    "Schedule",
    "Status",
    "Actions",
  ],
};

function StatusCell({ status }: { status: BookingRecord["status"] }) {
  return (
    <Badge className={`capitalize ${bookingStatusBadge(status)}`}>
      {bookingStatusLabels[status]}
    </Badge>
  );
}

function CustomerRow({ booking }: { booking: BookingRecord }) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">
        {shortBookingId(booking.id)}
      </TableCell>
      <TableCell className="font-medium">{booking.serviceTitle}</TableCell>
      <TableCell>{booking.technicianName}</TableCell>
      <TableCell>{formatSchedule(booking.scheduledFor)}</TableCell>
      <TableCell>
        <StatusCell status={booking.status} />
      </TableCell>
      <TableCell>
        <BookingActions booking={booking} scope="customer" />
      </TableCell>
    </TableRow>
  );
}

function TechnicianRow({ booking }: { booking: BookingRecord }) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">
        {shortBookingId(booking.id)}
      </TableCell>
      <TableCell className="font-medium">{booking.serviceTitle}</TableCell>
      <TableCell>
        <div>{booking.customerName || "Customer"}</div>
        <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
      </TableCell>
      <TableCell>{formatSchedule(booking.scheduledFor)}</TableCell>
      <TableCell>
        <StatusCell status={booking.status} />
      </TableCell>
      <TableCell>
        <BookingActions booking={booking} scope="technician" />
      </TableCell>
    </TableRow>
  );
}

function AdminRow({ booking }: { booking: BookingRecord }) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">
        {shortBookingId(booking.id)}
      </TableCell>
      <TableCell>
        <div>{booking.customerName || "Customer"}</div>
        <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
      </TableCell>
      <TableCell className="font-medium">{booking.serviceTitle}</TableCell>
      <TableCell>{booking.technicianName}</TableCell>
      <TableCell>{formatSchedule(booking.scheduledFor)}</TableCell>
      <TableCell>
        <StatusCell status={booking.status} />
      </TableCell>
      <TableCell>
        <BookingActions booking={booking} scope="admin" />
      </TableCell>
    </TableRow>
  );
}

export function BookingsTable({
  bookings,
  scope,
}: {
  bookings: BookingRecord[];
  scope: BookingScope;
}) {
  const headers = headersByScope[scope];

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
          {bookings.map((booking) =>
            scope === "customer" ? (
              <CustomerRow key={booking.id} booking={booking} />
            ) : scope === "technician" ? (
              <TechnicianRow key={booking.id} booking={booking} />
            ) : (
              <AdminRow key={booking.id} booking={booking} />
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}
