"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";

// Auth provider component that initializes authentication state
function AuthProvider({ children }: { children: ReactNode }) {
  useAuth(); // This will initialize the auth listener
  return <>{children}</>;
}

// This component can be expanded to include other providers like React Query, ThemeProvider, etc.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
