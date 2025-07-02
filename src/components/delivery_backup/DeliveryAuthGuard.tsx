"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useDeliveryAuth } from "@/hooks/use-delivery-auth";

interface DeliveryAuthGuardProps {
  children: React.ReactNode;
}

export default function DeliveryAuthGuard({
  children,
}: DeliveryAuthGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const { isDelivery, checkDeliveryStatus, loading } = useDeliveryAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("DeliveryAuthGuard effect:", {
      pathname,
      loading,
      userEmail: user?.email,
      isAuthenticated,
      isDelivery,
    });

    // Wait for auth state to load
    if (loading) {
      return;
    }

    // Check delivery status when user is authenticated
    if (user && isAuthenticated && !isDelivery) {
      checkDeliveryStatus(user.email);
    }

    // If on delivery login page and user is authenticated delivery person, redirect to delivery dashboard
    if (
      pathname === "/delivery/login" &&
      user &&
      isAuthenticated &&
      isDelivery
    ) {
      console.log("Redirecting authenticated delivery person to dashboard");
      router.push("/delivery");
      return;
    }

    // If not on delivery login page and not authenticated or not delivery person, redirect to delivery login
    if (
      pathname !== "/delivery/login" &&
      (!user || !isAuthenticated || !isDelivery)
    ) {
      console.log("Redirecting non-delivery user to delivery login");
      router.push("/delivery/login");
      return;
    }
  }, [
    user,
    isAuthenticated,
    isDelivery,
    loading,
    router,
    pathname,
    checkDeliveryStatus,
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading Delivery Panel...
          </p>
        </div>
      </div>
    );
  }

  // If on delivery login page, always show children
  if (pathname === "/delivery/login") {
    return <>{children}</>;
  }

  // Only show children if user is authenticated and is delivery person
  if (user && isAuthenticated && isDelivery) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}
