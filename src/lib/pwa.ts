// Register service worker
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then((registration) => {
                    console.log('SW registered:', registration);
                })
                .catch((error) => {
                    console.log('SW registration failed:', error);
                });
        });
    }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return 'denied';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission;
    }

    return Notification.permission;
}

// Subscribe to push notifications
export async function subscribeToPush(): Promise<PushSubscription | null> {
    try {
        const registration = await navigator.serviceWorker.ready;

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            return subscription;
        }

        // Subscribe to push notifications
        // Note: You'll need to generate VAPID keys for production
        // For now, this is a placeholder
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                // This is a placeholder VAPID public key
                // In production, replace with your actual VAPID public key
                'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrAC5C_RhujHC7EFOHLm7s7sxNL-8n6e8L4Gg8dU4OqVnXo3Ey0'
            ) as BufferSource,
        });

        return subscription;
    } catch (error) {
        console.error('Failed to subscribe to push:', error);
        return null;
    }
}

// Send a test notification
export async function sendTestNotification(title: string, body: string) {
    const permission = await requestNotificationPermission();

    if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;

        registration.showNotification(title, {
            body,
            icon: '/icon.svg',
            badge: '/icon.svg',
            tag: 'super-copa-test',
        });
    }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
