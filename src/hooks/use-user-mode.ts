import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getCurrentUserMode, switchUserRole } from '@/api/productApi';
import { useAuthStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to manage user mode across the application
 * Ensures that all pages except deals page default to "user" mode
 */
export const useUserMode = () => {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const ensureUserMode = async () => {
      // Only check if user is authenticated
      if (!isAuthenticated) return;

      // Skip mode checking for deals page and admin routes
      if (pathname === '/deals' || pathname.startsWith('/admin') || pathname.startsWith('/delivery') || pathname.startsWith('/account')) {
        return;
      }

      // Prevent multiple simultaneous calls
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        // Check current user mode
        const currentMode = await getCurrentUserMode();
        
        // If user is in business mode, switch them to user mode
        if (currentMode.mode === 'business') {
          //console.log('User is in business mode, switching to user mode for page:', pathname);
          await switchUserRole();
          
          // Optional: Show a toast notification
          // Commented out to avoid spam, but can be enabled if needed
          // toast({
          //   title: "Switched to User Mode",
          //   description: "You're now in user mode.",
          // });
        }
      } catch (error) {
        console.error('Error checking/switching user mode:', error);
        // Fail silently - don't disrupt user experience
      } finally {
        isProcessingRef.current = false;
      }
    };

    ensureUserMode();
  }, [isAuthenticated, pathname]);
};
