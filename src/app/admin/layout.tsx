import type { Metadata } from "next";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "RoyalFresh Admin Dashboard",
  description: "Admin dashboard for managing RoyalFresh e-commerce platform",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthGuard>
      <AdminLayout>{children}</AdminLayout>
      <Toaster />
    </AdminAuthGuard>
  );
}
