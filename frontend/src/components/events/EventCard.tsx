import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from '../common/OptimizedImage';

import { Event } from '../../types/event';

interface EventCardProps {
  event: Event;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(price);
};

const EventCard = ({ event }: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  return (
    <motion.div
      className="relative aspect-[2/3] rounded-xl overflow-hidden group shadow-sm 
        hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1
        bg-white"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/events/${event.id}`} className="block w-full h-full">
        <OptimizedImage
          src={event.imageUrl || event.image_url || '/images/placeholder.jpg'}
          alt={event.title}
          className="transform transition-all duration-300 group-hover:scale-105"
          onLoad={handleImageLoad}
        />
        
        {/* Gradient Overlays */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
            transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
        />
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent 
            mix-blend-overlay transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* View Button */}
        <AnimatePresence>
          {isHovered && isImageLoaded && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="px-6 py-2 bg-white/90 backdrop-blur-sm text-gray-900 font-medium rounded-full 
                  transform transition-all duration-300 shadow-elevated hover:shadow-floating hover:scale-105
                  active:scale-95 border border-white/20"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                View Details
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title and Price */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isImageLoaded ? 1 : 0,
            y: isImageLoaded ? 0 : 20
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-base font-semibold line-clamp-2 drop-shadow-lg tracking-tight mb-1 font-display">
            {event.title}
          </h3>
          {event.price && (
            <p className="text-sm font-medium text-white/90 drop-shadow-lg">
              {formatPrice(event.price)}
            </p>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
