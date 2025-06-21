"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle2, Package, MapPin, Heart, Sparkles } from "lucide-react";

export default function AccountTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      value: "/account",
      label: "Profile",
      icon: <UserCircle2 className="mr-2 h-4 w-4" />,
      description: "Personal info",
    },
    {
      value: "/account/orders",
      label: "Orders",
      icon: <Package className="mr-2 h-4 w-4" />,
      description: "Order history",
    },
    {
      value: "/account/addresses",
      label: "Addresses",
      icon: <MapPin className="mr-2 h-4 w-4" />,
      description: "Delivery locations",
    },
    {
      value: "/account/wishlist",
      label: "Wishlist",
      icon: <Heart className="mr-2 h-4 w-4" />,
      description: "Saved items",
    },
  ];

  const getCurrentTab = () => {
    let currentTab = "/account"; // Default to /account
    // Check for exact match first or if it's a base path for a more specific tab.
    const exactMatch = tabs.find((tab) => tab.value === pathname);
    if (exactMatch) return exactMatch.value;

    // If no exact match, find the longest path that starts with a tab's value.
    // This handles nested routes under a tab, e.g. /account/orders/details
    for (const tab of tabs) {
      if (
        pathname.startsWith(tab.value) &&
        tab.value.length > currentTab.length
      ) {
        currentTab = tab.value;
      }
    }
    // Ensure /account is correctly selected if no other longer path matches
    if (
      pathname === "/account" ||
      (pathname.startsWith("/account/") && currentTab === "/account")
    ) {
      return "/account";
    }
    return currentTab;
  };

  return (
    <div className="relative mb-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl opacity-50"></div>

      <Tabs
        value={getCurrentTab()}
        onValueChange={(value) => router.push(value)}
        className="relative"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl p-2 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex flex-col items-center justify-center p-4 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105 group"
            >
              <div className="flex items-center mb-1">
                <div className="group-data-[state=active]:animate-pulse">
                  {tab.icon}
                </div>
                <span className="font-medium">{tab.label}</span>
              </div>
              <span className="text-xs opacity-70 hidden sm:block">
                {tab.description}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
