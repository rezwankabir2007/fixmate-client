import { redirect } from "next/navigation";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function DashboardPage() {
  const user = await requireDashboardUser();
  redirect(`/dashboard/${user.role}`);
}
