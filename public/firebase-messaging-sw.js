// Import the functions you need from the SDKs you need
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "your-api-key", // Replace with your actual config
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
    //console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification.body || 'You have a new message',
        icon: '/icon-192x192.png', // Add your app icon
        badge: '/badge-72x72.png', // Add your badge icon
        tag: 'freshgift-notification',
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: 'View',
                icon: '/action-view.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/action-dismiss.png'
            }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
    //console.log('[firebase-messaging-sw.js] Notification click received.');

    event.notification.close();

    if (event.action === 'view') {
        // Handle view action
        event.waitUntil(
            clients.openWindow('/') // Navigate to your app
        );
    } else if (event.action === 'dismiss') {
        // Handle dismiss action
        //console.log('Notification dismissed');
    } else {
        // Handle default click
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
