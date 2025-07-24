"use client";

import { useUserMode } from "@/hooks/use-user-mode";

/**
 * Component that manages user mode across the application
 * This component should be included at the app level to ensure
 * users are in the correct mode based on the current page
 */
export default function UserModeManager() {
  useUserMode();

  // This component doesn't render anything
  return null;
}
