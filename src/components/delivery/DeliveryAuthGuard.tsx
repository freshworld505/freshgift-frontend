"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useDeliveryAuth } from "@/hooks/use-delivery-auth";

interface DeliveryAuthGuardProps {
  children: React.ReactNode;
}

export default function DeliveryAuthGuard({
  children,
}: DeliveryAuthGuardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { isDelivery, checkDeliveryStatus, loading } = useDeliveryAuth();
  const router = useRouter();

  useEffect(() => {
    // Check delivery status when user is authenticated
    if (user?.email) {
      checkDeliveryStatus(user.email);
    }
  }, [user?.email, checkDeliveryStatus]);

  // If not authenticated, redirect to main login
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  // Show loading state while checking delivery status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Checking delivery permissions...
          </p>
        </div>
      </div>
    );
  }

  // If user is not a delivery partner, show access denied
  if (!isDelivery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access the delivery panel. This area is
            restricted to delivery partners only.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and is a delivery partner, show the content
  return <>{children}</>;
}
