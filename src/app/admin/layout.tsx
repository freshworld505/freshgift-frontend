import type { Metadata } from "next";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "FreshGift Admin Dashboard",
  description: "Admin dashboard for managing FreshGift e-commerce platform",
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
