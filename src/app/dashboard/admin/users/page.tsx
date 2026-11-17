import { DashboardDataError } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getAdminAccounts } from "@/lib/dashboard-data";

export default async function AdminUsersPage() {
  const user = await requireDashboardUser("admin");
  let accounts = null;
  let loadFailed = false;

  try {
    accounts = await getAdminAccounts();
  } catch (error) {
    console.error("Failed to load admin account list.", error);
    loadFailed = true;
  }

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/admin/users"
      title="User accounts"
      description="Read-only account directory from BetterAuth. Account mutations are not enabled."
    >
      {loadFailed ? <DashboardDataError feature="User accounts" /> : null}
      {accounts ? (
        <div className="rounded-2xl border border-border bg-card/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length ? accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name || "—"}</TableCell>
                  <TableCell>{account.email || "—"}</TableCell>
                  <TableCell className="capitalize">{account.role}</TableCell>
                  <TableCell>{account.createdAt ? new Date(account.createdAt).toLocaleDateString() : "—"}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 whitespace-normal text-center text-muted-foreground">
                    No user accounts were found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </DashboardShell>
  );
}
