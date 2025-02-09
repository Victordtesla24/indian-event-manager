import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventStore } from '../../stores/eventStore';

interface CarouselImage {
  id: number;
  imageUrl: string;
  link: string;
  title: string;
}

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { events, loading } = useEventStore();
  const promotedEvents = events
    .filter(event => event.is_promoted)
    .slice(0, 6)
    .map(event => ({
      id: event.id,
      imageUrl: event.banner_url,
      link: `/events/${event.id}`,
      title: event.title,
    }));

  const nextSlide = useCallback(() => {
    if (promotedEvents.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promotedEvents.length);
  }, [promotedEvents.length]);

  const prevSlide = useCallback(() => {
    if (promotedEvents.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + promotedEvents.length) % promotedEvents.length);
  }, [promotedEvents.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [promotedEvents]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  if (loading || promotedEvents.length === 0) {
    return (
      <div className="relative w-full">
        <div className="relative aspect-[2/1] md:aspect-[3/1] bg-gray-100 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400">
              {loading ? 'Loading...' : 'No featured events'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200/20 z-10">
        <div
          className={`h-full bg-white/60 transition-all duration-250 ${
            isAutoPlaying ? 'animate-progress' : ''
          }`}
          style={{ animationPlayState: isAutoPlaying ? 'running' : 'paused' }}
        />
      </div>

      {/* Main Carousel */}
      <div className="relative aspect-[2/1] md:aspect-[3/1] overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Link to={promotedEvents[currentIndex].link} className="block w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={promotedEvents[currentIndex].imageUrl}
                  alt={promotedEvents[currentIndex].title}
                  className="w-full h-full object-cover"
                  loading={currentIndex === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-8 md:bottom-16 left-6 md:left-12 right-6 md:right-12 text-white">
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {promotedEvents[currentIndex].title}
                  </h2>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/80 text-gray-800 
            hover:bg-white hover:text-primary-600 transition-all duration-250 z-10
            backdrop-blur-[2px] shadow-md hover:shadow-lg transform hover:scale-105
            active:scale-95"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 rounded-full bg-white/80 text-gray-800 
            hover:bg-white hover:text-primary-600 transition-all duration-250 z-10
            backdrop-blur-[2px] shadow-md hover:shadow-lg transform hover:scale-105
            active:scale-95"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {promotedEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-250 ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
