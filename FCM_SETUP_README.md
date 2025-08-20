# Firebase Cloud Messaging (FCM) Setup Guide

This guide explains how to set up and use Firebase Cloud Messaging (FCM) for push notifications in your FreshGift application.

## 📋 Prerequisites

1. Firebase project with Cloud Messaging enabled
2. VAPID key generated in Firebase Console
3. Service worker support in your browser

## 🔧 Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# FCM VAPID Key (required for web push)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key

# Backend URL
NEXT_PUBLIC_BACKEND_URL=your_backend_url
```

## 🚀 Setup Steps

### 1. Update Service Worker Configuration

Edit `/public/firebase-messaging-sw.js` and replace the placeholder config with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-actual-auth-domain",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-storage-bucket",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id",
  measurementId: "your-actual-measurement-id",
};
```

### 2. Install Required Dependencies

Make sure you have the Firebase SDK installed:

```bash
npm install firebase
```

### 3. Register Service Worker

Add this to your `next.config.ts` to serve the service worker:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/firebase-messaging-sw.js",
        destination: "/firebase-messaging-sw.js",
      },
    ];
  },
};

module.exports = nextConfig;
```

## 🎯 Usage

### Using the FCM Hook

```typescript
import { useFCM } from "../hooks/use-fcm";

function MyComponent() {
  const { fcmToken, isRegistered, isLoading, error, registerToken } = useFCM();

  useEffect(() => {
    if (fcmToken && !isRegistered) {
      registerToken();
    }
  }, [fcmToken, isRegistered]);

  return (
    <div>
      {fcmToken ? <p>FCM Token: {fcmToken}</p> : <p>Generating FCM token...</p>}
    </div>
  );
}
```

### Manual FCM Token Management

```typescript
import { getFCMToken, registerFCMToken } from "../api/notification";

// Get FCM token
const token = await getFCMToken();

// Register token with backend (requires authentication)
const success = await registerFCMToken("web");
```

### Using the FCM Manager Component

```typescript
import FCMTokenManager from "../components/notifications/FCMTokenManager";

function SettingsPage() {
  return (
    <div>
      <h1>Notification Settings</h1>
      <FCMTokenManager />
    </div>
  );
}
```

## 🔄 API Functions

### `getFCMToken()`

- Gets FCM token from Firebase
- Returns: `Promise<string | null>`

### `registerFCMToken(deviceType?: string)`

- Registers FCM token with your backend
- Requires user authentication
- Returns: `Promise<boolean>`

### `sendFCMtokenToBackend(fcmToken: string, deviceType: string)`

- Sends FCM token to backend with authentication headers
- Returns: `Promise<any>`

### `setupFCMMessageListener(callback: (payload: any) => void)`

- Sets up foreground message listener
- Handles messages when app is in foreground

## 🔒 Authentication

The FCM system is integrated with your authentication system:

1. **Authentication Required**: FCM token registration requires the user to be authenticated
2. **Automatic Headers**: Authentication headers are automatically added to API calls
3. **Token Caching**: JWT tokens are cached to avoid unnecessary API calls

## 🛠️ Error Handling

Common errors and solutions:

### "User not authenticated"

- Ensure user is logged in before registering FCM token
- Check if `ensureAuthenticated()` returns true

### "No registration token available"

- Check if VAPID key is correctly set
- Verify notification permissions are granted
- Ensure service worker is registered

### "Failed to send FCM token"

- Check backend API endpoint is working
- Verify authentication headers are correct
- Check network connectivity

## 📱 Testing

### Test FCM Token Generation

```typescript
import { getFCMToken } from "../api/notification";

// Test in browser console
getFCMToken().then((token) => {
  console.log("FCM Token:", token);
});
```

### Test Token Registration

```typescript
import { registerFCMToken } from "../api/notification";

// Test after user authentication
registerFCMToken().then((success) => {
  console.log("Registration successful:", success);
});
```

## 🔔 Notification Types

### Foreground Notifications

- Handled by `setupFCMMessageListener`
- Shows browser notification while app is open

### Background Notifications

- Handled by service worker (`firebase-messaging-sw.js`)
- Shows notification when app is closed or minimized

## 📋 Backend Requirements

Your backend should have an endpoint that:

1. Accepts FCM tokens with authentication
2. Stores tokens associated with user accounts
3. Sends push notifications using Firebase Admin SDK

Example backend endpoint structure:

```
POST /api/fcm/register-token
Headers: Authorization: Bearer <jwt-token>
Body: { fcmToken: string, deviceType: string }
```

## 🚨 Security Considerations

1. **VAPID Key**: Keep your VAPID key secure and don't expose it in client-side code beyond environment variables
2. **Token Storage**: FCM tokens are stored in localStorage - consider security implications
3. **Authentication**: Always validate JWT tokens on your backend
4. **Token Refresh**: Implement token refresh logic for expired tokens

## 📊 Monitoring

Monitor these metrics:

- Token generation success rate
- Registration success rate
- Message delivery rates
- Permission grant rates

## 🔧 Troubleshooting

1. **Check browser console** for Firebase errors
2. **Verify service worker** is registered and active
3. **Test notification permissions** in browser settings
4. **Check Firebase Console** for project configuration
5. **Validate environment variables** are correctly set

For more help, check the Firebase documentation: https://firebase.google.com/docs/cloud-messaging/js/client
