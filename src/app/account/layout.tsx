"use client";
import type { ReactNode } from "react";
import AccountTabs from "@/components/account/AccountTabs";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [isAuthenticated, router]);

  if (!isClient || !isAuthenticated) {
    return (
      <div className="text-center py-10">Loading account information...</div>
    ); // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            My Account
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your profile, orders, and preferences
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <AccountTabs />

          {/* Content Card with Modern Design */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
