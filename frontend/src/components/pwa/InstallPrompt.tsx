import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pwaManager from '../../utils/pwa';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if PWA can be installed every 30 seconds
    const checkInstallability = () => {
      setShowPrompt(pwaManager.canInstall());
    };

    checkInstallability();
    const interval = setInterval(checkInstallability, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleInstall = async () => {
    const installed = await pwaManager.promptInstall();
    if (installed) {
      setShowPrompt(false);
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 z-50"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                src="/icons/icon-96x96.png"
                alt="App Icon"
                className="h-10 w-10 rounded-lg"
              />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                Install Indian Event Manager
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Install our app for a better experience with offline access and quick updates.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={handleInstall}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Install Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrompt(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Maybe Later
                </button>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                onClick={() => setShowPrompt(false)}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
