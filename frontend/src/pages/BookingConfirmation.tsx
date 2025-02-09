import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookingConfirmation = () => {
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState<{
    eventId: number;
    eventTitle: string;
    date: string;
    time: string;
    quantity: number;
    totalPrice: number;
    venue: string;
    bookingTime: string;
  } | null>(null);

  useEffect(() => {
    const bookingData = sessionStorage.getItem('lastBooking');
    if (!bookingData) {
      navigate('/');
      return;
    }

    setBookingDetails(JSON.parse(bookingData));

    // Clear the booking data after loading
    return () => {
      sessionStorage.removeItem('lastBooking');
    };
  }, [navigate]);

  if (!bookingDetails) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-8 text-center"
      >
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <div className="text-gray-600 space-y-2">
            <p className="font-medium text-lg">{bookingDetails.eventTitle}</p>
            <p>
              {new Date(bookingDetails.date).toLocaleDateString()} at {bookingDetails.time}
            </p>
            <p>{bookingDetails.quantity} {bookingDetails.quantity === 1 ? 'ticket' : 'tickets'}</p>
            <p className="font-medium">Total: ₹{bookingDetails.totalPrice}</p>
            <p className="text-sm">Venue: {bookingDetails.venue}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">What's Next?</h2>
          <div className="grid gap-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Check Your Email</h3>
                <p className="text-sm text-gray-600">
                  We've sent your e-tickets to your registered email address.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Save the Date</h3>
                <p className="text-sm text-gray-600">
                  Add the event to your calendar to make sure you don't miss it.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-500"
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
              </div>
              <div>
                <h3 className="font-medium">Arrive Early</h3>
                <p className="text-sm text-gray-600">
                  We recommend arriving 30 minutes before the event starts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
