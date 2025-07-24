"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import UserModeManager from "@/components/layout/UserModeManager";

// Auth provider component that initializes authentication state
function AuthProvider({ children }: { children: ReactNode }) {
  useAuth(); // This will initialize the auth listener
  return <>{children}</>;
}

// This component can be expanded to include other providers like React Query, ThemeProvider, etc.
export function Providers({ children }: { children: ReactNode }) {
  // Create a stable query client instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserModeManager />
        {children}
        <Toaster />
      </AuthProvider>
      {/* React Query DevTools - only shows in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
