"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAdminAuth } from "@/hooks/use-admin-auth";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, checkAdminStatus, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("AdminAuthGuard effect:", {
      pathname,
      loading,
      userEmail: user?.email,
      isAuthenticated,
      isAdmin,
    });

    // Wait for auth state to load
    if (loading) {
      return;
    }

    // Check admin status when user is authenticated
    if (user && isAuthenticated && !isAdmin) {
      checkAdminStatus(user.email);
    }

    // If on admin login page and user is authenticated admin, redirect to admin dashboard
    if (pathname === "/admin/login" && user && isAuthenticated && isAdmin) {
      console.log("Redirecting authenticated admin to dashboard");
      router.push("/admin");
      return;
    }

    // If not on admin login page and not authenticated or not admin, redirect to admin login
    if (
      pathname !== "/admin/login" &&
      (!user || !isAuthenticated || !isAdmin)
    ) {
      console.log("Redirecting non-admin user to admin login");
      router.push("/admin/login");
      return;
    }
  }, [
    user,
    isAuthenticated,
    isAdmin,
    loading,
    router,
    pathname,
    checkAdminStatus,
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading Admin Panel...
          </p>
        </div>
      </div>
    );
  }

  // If on admin login page, always show children
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Only show children if user is authenticated and is admin
  if (user && isAuthenticated && isAdmin) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}
