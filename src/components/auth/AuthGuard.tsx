"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { Loader2 } from "lucide-react";
import FloatingAiAssistant from "@/components/ai/FloatingAiAssistant";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/signup", "/", "/products"];

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Import the auth helper to fetch user from backend
          const { getCurrentUser } = await import("@/lib/auth");
          const user = await getCurrentUser();
          if (user) {
            login(user);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error fetching user from backend:", error);
          logout();
        }
      } else {
        logout();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [login, logout]);

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute =
        PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/products/");
      const isAuthPage = pathname === "/login" || pathname === "/signup";

      if (!isAuthenticated && !isPublicRoute) {
        // Redirect to login with return URL
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (isAuthenticated && isAuthPage) {
        // Redirect authenticated users away from login/signup pages only
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading FreshGift...</p>
        </div>
      </div>
    );
  }

  // Show login prompt for unauthenticated users on protected routes
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-muted-foreground">
              Please sign in to access FreshGift and start shopping for fresh
              produce.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render children for authenticated users or public routes
  return (
    <>
      {children}
      {isAuthenticated && <FloatingAiAssistant />}
    </>
  );
}
