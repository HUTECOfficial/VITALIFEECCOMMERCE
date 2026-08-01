import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/admin-products";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const data = await getAdminDashboardData();
  return <AdminDashboard {...data} />;
}
