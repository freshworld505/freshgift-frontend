"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { getBusinessStatus } from "@/api/BusinessUserApi";
import { switchUserRole, getCurrentUserMode } from "@/api/productApi";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Building2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessStatusResponse {
  message: string;
  status: "pending" | "approved" | "rejected";
  request: {
    businessName: string;
    // ... other fields
  };
}

interface BusinessRoleToggleProps {
  className?: string;
  variant?: "dropdown" | "standalone";
}

export default function BusinessRoleToggle({
  className = "",
  variant = "dropdown",
}: BusinessRoleToggleProps) {
  const [businessStatus, setBusinessStatus] =
    useState<BusinessStatusResponse | null>(null);
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const { toast } = useToast();

  // Check business status and current mode on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [status, currentMode] = await Promise.all([
          getBusinessStatus(),
          getCurrentUserMode(),
        ]);

        setBusinessStatus(status);
        setIsBusinessMode(currentMode.mode === "business");
        setIsLoading(false);
      } catch (error) {
        console.error(
          "Failed to fetch business status or current mode:",
          error
        );
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  // Don't render if loading or user doesn't have approved business status
  if (isLoading || !businessStatus || businessStatus.status !== "approved") {
    return null;
  }

  const handleRoleSwitch = async () => {
    if (isSwitching) return;

    setIsSwitching(true);
    try {
      await switchUserRole();
      const newMode = !isBusinessMode;
      setIsBusinessMode(newMode);

      toast({
        title: "Role switched successfully",
        description: `Switched to ${newMode ? "business" : "user"} mode`,
      });
    } catch (error) {
      console.error("Failed to switch role:", error);
      toast({
        title: "Failed to switch role",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  };

  if (variant === "dropdown") {
    return (
      <DropdownMenuItem
        className={`p-3 cursor-pointer focus:bg-muted/50 ${className}`}
        onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {isBusinessMode ? (
              <Building2 className="h-4 w-4 text-blue-600" />
            ) : (
              <User className="h-4 w-4 text-green-600" />
            )}
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {isBusinessMode ? "Business Mode" : "User Mode"}
              </span>
              <span className="text-xs text-muted-foreground">
                {businessStatus.request.businessName}
              </span>
            </div>
          </div>
          <Switch
            checked={isBusinessMode}
            onCheckedChange={handleRoleSwitch}
            disabled={isSwitching}
            className="ml-2"
          />
        </div>
      </DropdownMenuItem>
    );
  }

  // Standalone variant for use in other components
  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg ${className}`}
    >
      <div className="flex items-center gap-3">
        {isBusinessMode ? (
          <Building2 className="h-5 w-5 text-blue-600" />
        ) : (
          <User className="h-5 w-5 text-green-600" />
        )}
        <div className="flex flex-col">
          <span className="font-medium">
            {isBusinessMode ? "Business Mode" : "User Mode"}
          </span>
          <span className="text-sm text-muted-foreground">
            {businessStatus.request.businessName}
          </span>
        </div>
      </div>
      <Switch
        checked={isBusinessMode}
        onCheckedChange={handleRoleSwitch}
        disabled={isSwitching}
      />
    </div>
  );
}
