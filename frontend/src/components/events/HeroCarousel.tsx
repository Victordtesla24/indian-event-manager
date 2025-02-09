import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventStore } from '../../stores/eventStore';

export default function HeroCarousel() {
  const events = useEventStore((state) => state.events.slice(0, 5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = events.length - 1;
      if (nextIndex >= events.length) nextIndex = 0;
      return nextIndex;
    });
  };

  if (!events.length) return null;

  const currentEvent = events[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-gray-100">
      {/* Desktop aspect ratio */}
      <div className="hidden md:block" style={{ paddingTop: '25%' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <Link to={`/events/${currentEvent.id}`} className="block w-full h-full group">
                <img
                  src={currentEvent.image_url || '/images/event-placeholder.jpg'}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile aspect ratio */}
      <div className="md:hidden" style={{ paddingTop: '100%' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <Link to={`/events/${currentEvent.id}`} className="block w-full h-full group">
                <img
                  src={currentEvent.image_url || '/images/event-placeholder.jpg'}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation dots with progress bar */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className="relative"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-red-600' : 'bg-white/70 hover:bg-white'
              }`}
            />
            {index === currentIndex && (
              <svg
                className="absolute -inset-1 text-red-600 animate-[spin_5s_linear_infinite]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                />
                <path
                  className="opacity-75"
                  d="M12 2a10 10 0 0 1 10 10"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Arrow navigation */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
