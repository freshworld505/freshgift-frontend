import { useState, useEffect } from 'react';
import { getFCMToken, registerFCMToken, setupFCMMessageListener } from '../api/notification';
import { useAuth } from './use-auth';

interface UseFCMReturn {
  fcmToken: string | null;
  isRegistered: boolean;
  isLoading: boolean;
  error: string | null;
  registerToken: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

/**
 * Custom hook to manage Firebase Cloud Messaging (FCM) tokens
 * @returns UseFCMReturn object with token state and methods
 */
export const useFCM = (): UseFCMReturn => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  /**
   * Get and set FCM token
   */
  const getFCMTokenAndSet = async (): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getFCMToken();
      setFcmToken(token);
      
      if (token) {
        // Store token in localStorage for persistence
        localStorage.setItem('fcm_token', token);
      }
      
      return token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get FCM token';
      setError(errorMessage);
      console.error('Error getting FCM token:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register FCM token with backend
   */
  const registerToken = async (): Promise<void> => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const success = await registerFCMToken('web');
      setIsRegistered(success);

      if (success) {
        localStorage.setItem('fcm_registered', 'true');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register FCM token';
      setError(errorMessage);
      console.error('Error registering FCM token:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh FCM token
   */
  const refreshToken = async (): Promise<void> => {
    await getFCMTokenAndSet();
    if (isAuthenticated) {
      await registerToken();
    }
  };

  /**
   * Handle foreground messages
   */
  const handleForegroundMessage = (payload: any) => {
    //console.log('Foreground message received:', payload);
    
    // Show a custom notification or update UI
    if (Notification.permission === 'granted') {
      new Notification(payload.notification?.title || 'New Message', {
        body: payload.notification?.body || 'You have a new message',
        icon: '/icon-192x192.png',
        tag: 'freshgift-foreground'
      });
    }
  };

  // Initialize FCM when component mounts
  useEffect(() => {
    const initializeFCM = async () => {
      // Check for stored token
      const storedToken = localStorage.getItem('fcm_token');
      const storedRegistered = localStorage.getItem('fcm_registered') === 'true';
      
      if (storedToken) {
        setFcmToken(storedToken);
        setIsRegistered(storedRegistered);
      }

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        //console.log('Notification permission:', permission);
      }

      // Get new token
      await getFCMTokenAndSet();

      // Setup message listener
      setupFCMMessageListener(handleForegroundMessage);
    };

    initializeFCM();
  }, []);

  // Register token when user authenticates
  useEffect(() => {
    if (isAuthenticated && fcmToken && !isRegistered) {
      registerToken();
    }
  }, [isAuthenticated, fcmToken, isRegistered]);

  // Clear state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setIsRegistered(false);
      localStorage.removeItem('fcm_registered');
    }
  }, [isAuthenticated]);

  return {
    fcmToken,
    isRegistered,
    isLoading,
    error,
    registerToken,
    refreshToken
  };
};
