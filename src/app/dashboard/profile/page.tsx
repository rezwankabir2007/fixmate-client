import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard-shell";
import { ProfileForm } from "@/components/profile-form";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function DashboardProfilePage() {
  const user = await requireDashboardUser();

  return (
    <DashboardShell
      user={user}
      activeHref="/dashboard/profile"
      title="Profile"
      description="Review your account information and update your display name."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(240px,0.7fr)]">
        <ProfileForm name={user.name} email={user.email} />
        <Card className="h-fit border-border bg-card/80">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-sm text-muted-foreground">Account role</p>
              <Badge className="mt-2 capitalize">{user.role}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="mt-1 break-all font-mono text-xs text-foreground">{user.id}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Role changes are not available in profile settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
