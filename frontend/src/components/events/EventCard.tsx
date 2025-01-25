import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Event } from '../../stores/eventStore';
import {
  getOptimizedImageUrl,
  preloadImage,
  FALLBACK_EVENT_IMAGE
} from '../../utils/imageLoader';

interface EventCardProps {
  event: Event;
  priority?: boolean;
}

const EventCard = ({ event, priority = false }: EventCardProps) => {
  const [imageState, setImageState] = useState<{
    url: string;
    isLoading: boolean;
    error: boolean;
    retryCount: number;
    progress: number;
  }>({
    url: FALLBACK_EVENT_IMAGE,
    isLoading: true,
    error: false,
    retryCount: 0,
    progress: 0
  });

  useEffect(() => {
    const loadImage = async () => {
      // Reset state when image URL changes
      if (imageState.url !== FALLBACK_EVENT_IMAGE && event.imageUrl) {
        setImageState(prev => ({
          ...prev,
          isLoading: true,
          error: false,
          progress: 0
        }));
      }

      try {
        const optimizedUrl = await getOptimizedImageUrl(event.imageUrl, {
          width: 400,
          height: 300,
          quality: priority ? 90 : 75,
          format: 'webp',
          category: 'events'
        });

        // Preload the image to ensure it loads properly
        await preloadImage(optimizedUrl, 'events');

        setImageState({
          url: optimizedUrl,
          isLoading: false,
          error: false,
          retryCount: 0,
          progress: 100
        });
      } catch (error) {
        console.error('Error loading event image:', error);
        
        // Implement retry logic with exponential backoff
        if (imageState.retryCount < 3) {
          const delay = 2 ** imageState.retryCount * 1000;
          setTimeout(() => {
            setImageState(prev => ({
              ...prev,
              retryCount: prev.retryCount + 1,
              progress: 0
            }));
          }, delay);
        } else {
          setImageState({
            url: FALLBACK_EVENT_IMAGE,
            isLoading: false,
            error: true,
            retryCount: 0,
            progress: 0
          });
        }
      }
    };

    if (event.imageUrl) {
      loadImage();
    } else {
      setImageState({
        url: FALLBACK_EVENT_IMAGE,
        isLoading: false,
        error: false,
        retryCount: 0,
        progress: 0
      });
    }
  }, [event.imageUrl, imageState.retryCount, priority, imageState.url]);

  return (
    <Link 
      to={`/event/${event.id}`}
      className="block"
      aria-label={`View details for ${event.title}`}
    >
      <motion.div 
        className="group relative overflow-hidden rounded-lg shadow-lg h-64"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        {/* Loading State */}
        {imageState.isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div 
              className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
              role="progressbar"
              aria-label="Loading event image"
              aria-valuenow={imageState.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
            />
          </div>
        )}
        
        {/* Image */}
        <div className="relative w-full h-full">
          <img
            src={imageState.url}
            alt={event.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageState.isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => {
              setImageState(prev => ({
                ...prev,
                isLoading: false,
                error: false,
                progress: 100
              }));
            }}
            onError={() => {
              if (imageState.retryCount < 3) {
                const delay = 2 ** imageState.retryCount * 1000;
                setTimeout(() => {
                  setImageState(prev => ({
                    ...prev,
                    retryCount: prev.retryCount + 1,
                    progress: 0
                  }));
                }, delay);
              } else {
                setImageState({
                  url: FALLBACK_EVENT_IMAGE,
                  isLoading: false,
                  error: true,
                  retryCount: 0,
                  progress: 0
                });
              }
            }}
          />

          {/* Error Overlay */}
          {imageState.error && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              role="alert"
              aria-label="Error loading event image"
            >
              <div className="text-white text-center p-4">
                <svg 
                  className="w-8 h-8 mx-auto mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="img"
                  aria-label="Error icon"
                >
                  <title>Error loading image</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
                <p className="text-sm">Image unavailable</p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="space-y-2">
              {/* Category and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-red-400 font-medium">
                    {event.category}
                  </p>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full bg-opacity-50"
                    style={{
                      backgroundColor: event.status === 'upcoming' ? '#10B981' 
                        : event.status === 'ongoing' ? '#3B82F6'
                        : event.status === 'completed' ? '#6B7280'
                        : '#EF4444',
                      color: event.status === 'completed' ? '#D1D5DB' : 'white'
                    }}
                  >
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  {event.language}
                </p>
              </div>

              {/* Title */}
              <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
                {event.title}
              </h3>

              {/* Date and Location */}
              <div className="flex items-center justify-between text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="img"
                    aria-label="Calendar icon"
                  >
                    <title>Event date</title>
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="img"
                    aria-label="Location icon"
                  >
                    <title>Event location</title>
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  <span>{event.venue.city}</span>
                </div>
              </div>

              {/* Artists and Organizers Preview */}
              {(event.artists?.length > 0 || event.organizers?.length > 0) && (
                <div className="flex items-center space-x-2 text-xs text-gray-300">
                  {event.artists?.length > 0 && (
                    <span>
                      Artists: {event.artists.map(a => a.name).slice(0, 2).join(', ')}
                      {event.artists.length > 2 ? '...' : ''}
                    </span>
                  )}
                  {event.organizers?.length > 0 && (
                    <span>By: {event.organizers[0].name}</span>
                  )}
                </div>
              )}

              {/* Ticket Price Range if available */}
              {event.ticketing && (
                <div className="text-sm font-medium text-green-400">
                  {event.ticketing.priceRange.min === event.ticketing.priceRange.max 
                    ? `${event.ticketing.priceRange.currency} ${event.ticketing.priceRange.min}`
                    : `${event.ticketing.priceRange.currency} ${event.ticketing.priceRange.min} - ${event.ticketing.priceRange.max}`
                  }
                </div>
              )}

              {/* View Details Button */}
              <motion.div
                className="text-white text-sm font-medium opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center space-x-1"
                initial={false}
              >
                <span>View Details</span>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="img"
                  aria-label="Arrow icon"
                >
                  <title>View event details</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" 
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default EventCard;
