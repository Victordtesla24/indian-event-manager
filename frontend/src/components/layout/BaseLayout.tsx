import { Suspense, type ReactNode, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './Header';
import InstallPrompt from '../pwa/InstallPrompt';
import pwaManager from '../../utils/pwa';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.message}
          </p>
        </div>
        <div>
          <button
            onClick={resetErrorBoundary}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent" />
  </div>
);

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  useEffect(() => {
    // Request notification permission after user interaction
    const handleUserInteraction = () => {
      pwaManager.requestNotificationPermission();
      // Remove event listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        window.location.reload();
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Suspense fallback={<LoadingFallback />}>
          <main className="pt-16">
            {children}
          </main>
        </Suspense>
        <InstallPrompt />
      </div>
    </ErrorBoundary>
  );
};

export default BaseLayout;
