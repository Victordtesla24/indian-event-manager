interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Handle PWA install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e as BeforeInstallPromptEvent;
      });

      // Handle PWA installation
      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        this.trackInstallation();
      });

      // Handle service worker updates
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          this.registration = registration;
          this.checkForUpdates();
        });
      }
    }
  }

  // Check if PWA can be installed
  public canInstall(): boolean {
    return !!this.deferredPrompt;
  }

  // Prompt user to install PWA
  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      return choice.outcome === 'accepted';
    } catch (error) {
      console.error('Error prompting install:', error);
      return false;
    }
  }

  // Check for service worker updates
  private checkForUpdates(): void {
    if (!this.registration) return;

    setInterval(() => {
      this.registration?.update().catch(console.error);
    }, 1000 * 60 * 60); // Check every hour

    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration?.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.notifyUpdate();
        }
      });
    });
  }

  // Show update notification
  private notifyUpdate(): void {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <p class="text-gray-800 mr-4">A new version is available!</p>
        <div class="flex space-x-2">
          <button id="pwa-update-now" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Update Now
          </button>
          <button id="pwa-update-later" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Later
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    document.getElementById('pwa-update-now')?.addEventListener('click', () => {
      this.performUpdate();
      notification.remove();
    });

    document.getElementById('pwa-update-later')?.addEventListener('click', () => {
      notification.remove();
    });
  }

  // Perform the update
  private performUpdate(): void {
    if (!this.registration?.waiting) return;

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }

  // Track PWA installation (can be extended to send analytics)
  private trackInstallation(): void {
    console.log('PWA was installed');
    // Add analytics tracking here
  }

  // Request notification permission
  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Show a notification
  public async showNotification(title: string, options: NotificationOptions): Promise<boolean> {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }
}

export const pwaManager = new PWAManager();
export default pwaManager;
