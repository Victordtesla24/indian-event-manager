import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface BookingTimerProps {
  duration?: number; // Duration in seconds, default 5 minutes
  onTimeout: () => void;
}

const BookingTimer = ({ duration = 300, onTimeout }: BookingTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (timeLeft <= 60) {
      setIsWarning(true);
    }

    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg p-4 ${
        isWarning ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            className={`w-5 h-5 ${isWarning ? 'text-red-500' : 'text-blue-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={`text-sm font-medium ${isWarning ? 'text-red-800' : 'text-blue-800'}`}>
            Booking Session
          </span>
        </div>
        <div className="flex items-center">
          <motion.span
            key={timeLeft}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-lg font-bold ${isWarning ? 'text-red-600' : 'text-blue-600'}`}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isWarning ? 'bg-red-500' : 'bg-blue-500'
          }`}
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / duration) * 100}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>
      {isWarning && (
        <p className="mt-2 text-sm text-red-600">
          Please complete your booking soon to secure your tickets.
        </p>
      )}
    </motion.div>
  );
};

export default BookingTimer;
