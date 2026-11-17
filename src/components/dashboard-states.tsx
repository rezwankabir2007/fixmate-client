import Link from "next/link";
import { AlertCircle, ArrowRight, Database, Inbox } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DashboardDataError({ feature }: { feature: string }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300">
      <p className="flex items-center gap-2 font-semibold">
        <AlertCircle className="size-4" />
        {feature} could not be loaded.
      </p>
      <p className="mt-1 text-red-700/80 dark:text-red-300/80">
        Check the MongoDB connection and try again. No sample data is being shown.
      </p>
    </div>
  );
}

export function BackendFeatureNotice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="size-4 text-amber-600 dark:text-amber-300" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        This feature is not connected to a backend yet. No records or actions are simulated.
      </CardContent>
    </Card>
  );
}

export function EmptyTable({
  title,
  description,
  columns,
  headers,
}: {
  title: string;
  description: string;
  columns: number;
  headers: string[];
}) {
  return (
    <Card className="border-border bg-card/80">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => <TableHead key={header}>{header}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns} className="h-52 whitespace-normal text-center">
                <div className="mx-auto flex max-w-md flex-col items-center">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <Inbox className="size-5" />
                  </div>
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function DashboardLinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group block rounded-2xl border border-border bg-card/80 p-5 transition-colors hover:border-blue-500/30 hover:bg-blue-500/5">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-300">
        Open
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
