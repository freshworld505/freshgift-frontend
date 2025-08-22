import { ensureAuthenticated, getAuthHeaders, withAuthentication } from './ensureAuthenticated';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from '../config/firebase';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

/**
 * Get FCM token from Firebase
 * @returns Promise<string | null> - FCM token or null if failed
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      //console.log('Not in browser environment, skipping FCM token generation');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      //console.log('Service worker not supported, FCM not available');
      return null;
    }

    const messaging = getMessaging(app);
    
    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    });

    if (token) {
      //console.log('✅ FCM token generated:', token);
      return token;
    } else {
      //console.log('⚠️ No registration token available');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
};

/**
 * Send FCM token to backend with authentication
 * @param fcmToken - Firebase Cloud Messaging token
 * @param deviceType - Type of device (web, mobile, etc.)
 * @returns Promise<any> - Backend response
 */
export const sendFCMtokenToBackend = async (fcmToken: string, deviceType: string = 'web') => {
  return withAuthentication(async () => {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/fcm/register-token`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ fcmToken, deviceType }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to send FCM token: ${response.status} ${errorData}`);
      }

      const result = await response.json();
      //console.log('✅ FCM token sent to backend successfully');
      return result;
    } catch (error) {
      console.error('❌ Error sending FCM token:', error);
      throw error;
    }
  });
};

/**
 * Register FCM token for the current authenticated user
 * @param deviceType - Type of device (web, mobile, etc.)
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const registerFCMToken = async (deviceType: string = 'web'): Promise<boolean> => {
  try {
    // First ensure user is authenticated
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      console.error('❌ User not authenticated, cannot register FCM token');
      return false;
    }

    // Get FCM token
    const fcmToken = await getFCMToken();
    if (!fcmToken) {
      console.error('❌ Could not get FCM token');
      return false;
    }

    // Send token to backend
    await sendFCMtokenToBackend(fcmToken, deviceType);
    //console.log('✅ FCM token registered successfully');
    return true;
  } catch (error) {
    console.error('❌ Error registering FCM token:', error);
    return false;
  }
};

/**
 * Setup foreground message listener for FCM
 * @param onMessageReceived - Callback function when message is received
 */
export const setupFCMMessageListener = (onMessageReceived: (payload: any) => void) => {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    const messaging = getMessaging(app);
    
    onMessage(messaging, (payload) => {
      //console.log('📩 Foreground message received:', payload);
      onMessageReceived(payload);
    });
  } catch (error) {
    console.error('❌ Error setting up FCM message listener:', error);
  }
};