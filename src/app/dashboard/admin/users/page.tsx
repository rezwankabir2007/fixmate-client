
import { DashboardDataError } from "@/components/dashboard-states";
import { DashboardShell } from "@/components/dashboard-shell";
import { AdminAccountRoleActions } from "@/components/admin-account-role-actions";
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

export const instant = false;

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
      description="Manage customer and technician account roles securely."
    >
      {loadFailed ? <DashboardDataError feature="User accounts" /> : null}

      {accounts ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Manage Role</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {accounts.length ? (
                accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      {account.name || "—"}
                    </TableCell>

                    <TableCell>{account.email || "—"}</TableCell>

                    <TableCell className="capitalize">
                      {account.role}
                    </TableCell>

                    <TableCell>
                      {account.createdAt
                        ? new Date(account.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <AdminAccountRoleActions
                        accountId={account.id}
                        currentRole={account.role}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-40 whitespace-normal text-center text-muted-foreground"
                  >
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
