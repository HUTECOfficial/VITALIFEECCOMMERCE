import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/admin-products";
import { getAllSiteContent } from "@/lib/site-content";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const [data, initialContent] = await Promise.all([getAdminDashboardData(), getAllSiteContent()]);
  return <AdminDashboard {...data} initialContent={initialContent} />;
}
