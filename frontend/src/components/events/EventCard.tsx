import { useState } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../common/OptimizedImage';

interface EventCardProps {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isPromoted?: boolean;
  badgeText?: string;
  imagePriority?: boolean;
}

const EventCard = ({ 
  id, 
  title, 
  imageUrl, 
  link,
  isPromoted,
  badgeText,
  imagePriority 
}: EventCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link
      to={link}
      className="event-card relative block w-full overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 hover:scale-[1.03] group hover:shadow-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ aspectRatio: '3/4' }}
      aria-label={`View details for ${title}`}
    >
      <div className="w-full h-full relative">
        {/* Promoted badge aligned with Ticketalay's top-left placement */}
        {isPromoted && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-to-br from-red-700 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-xl shadow-black/30">
            {badgeText || 'Promoted'}
          </div>
        )}
        
        {/* Image container with hover zoom effect */}
        <div className="relative w-full h-full overflow-hidden">
          <OptimizedImage
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
            } group-hover:scale-105`}
            onLoad={() => setIsLoading(false)}
            loading={imagePriority ? 'eager' : 'lazy'}
            srcSet={`
              /images/events/${imageUrl}-612x612.jpg 612w,
              /images/events/${imageUrl}-1024x1024.jpg 1024w,
              /images/events/${imageUrl}-1536x1536.jpg 1536w
            `}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Gradient overlay matching Ticketalay's intensity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
        </div>
        
        {isLoading && (
          <div 
            className="absolute inset-0 bg-gray-100 animate-pulse"
            aria-busy="true"
            aria-label={`Loading ${title}`}
          />
        )}
      </div>
      
      {/* Persistent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-4">
        <div className="w-full text-center">
          <h3 className="text-white text-xl font-bold mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2">
            {title}
          </h3>
          <button
            type="button"
            className="bg-gradient-to-r from-red-700 to-orange-600 text-white px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-xl shadow-black/30 border-2 border-white/20"
            aria-label={`Book Now for ${title}`}
            tabIndex={-1}
          >
            Book Now
          </button>
        </div>
      </div>

    </Link>
  );
};

export default EventCard;
