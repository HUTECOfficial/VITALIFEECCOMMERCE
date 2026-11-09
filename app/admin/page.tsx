import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/admin-products";
import { getAdminOrders } from "@/lib/admin-orders";
import { getEnviaStatus, getShippingSettings } from "@/lib/envia";
import { getAllSiteContent } from "@/lib/site-content";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const [data, initialContent, orders, shippingSettings] = await Promise.all([
    getAdminDashboardData(),
    getAllSiteContent(),
    getAdminOrders(),
    getShippingSettings(),
  ]);
  return (
    <AdminDashboard
      {...data}
      initialContent={initialContent}
      orders={orders.orders}
      ordersError={orders.error}
      shippingSettings={shippingSettings}
      enviaStatus={getEnviaStatus()}
    />
  );
}
