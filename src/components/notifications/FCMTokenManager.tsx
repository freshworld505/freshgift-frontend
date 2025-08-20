import React from "react";
import { useFCM } from "../../hooks/use-fcm";
import { useAuth } from "../../hooks/use-auth";

const FCMTokenManager: React.FC = () => {
  const {
    fcmToken,
    isRegistered,
    isLoading,
    error,
    registerToken,
    refreshToken,
  } = useFCM();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Please log in to manage push notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Push Notification Settings</h3>

      <div className="space-y-4">
        {/* Token Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            FCM Token Status
          </label>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                fcmToken ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600">
              {fcmToken ? "Token Generated" : "No Token"}
            </span>
          </div>
        </div>

        {/* Registration Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Status
          </label>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isRegistered ? "bg-green-500" : "bg-yellow-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600">
              {isRegistered ? "Registered with Backend" : "Not Registered"}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* FCM Token Display */}
        {fcmToken && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FCM Token
            </label>
            <textarea
              value={fcmToken}
              readOnly
              className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-md font-mono"
              rows={3}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={registerToken}
            disabled={isLoading || !fcmToken}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registering..." : "Register Token"}
          </button>

          <button
            onClick={refreshToken}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Refreshing..." : "Refresh Token"}
          </button>
        </div>

        {/* Notification Permission Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Browser Permission
          </label>
          <span className="text-sm text-gray-600">
            {typeof window !== "undefined" && "Notification" in window
              ? `Notifications: ${Notification.permission}`
              : "Notifications not supported"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FCMTokenManager;
