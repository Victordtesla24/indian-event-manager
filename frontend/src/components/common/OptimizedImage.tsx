import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  priority?: boolean;
  onLoad?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[2/3]',
  objectFit = 'cover',
  priority = false,
  onLoad
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setError(false);

    // Generate tiny placeholder (in production this would be pre-generated)
    const placeholderSrc = `${src}?w=20&blur=10`;
    
    // Start with placeholder
    setCurrentSrc(placeholderSrc);

    // Load full image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
      onLoad?.();
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [src, onLoad]);

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    const widths = [320, 640, 960, 1280, 1920];
    return widths
      .map(width => `${src}?w=${width} ${width}w`)
      .join(', ');
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      <AnimatePresence mode="wait">
        {error ? (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Failed to load image</span>
          </div>
        ) : (
          <motion.img
            key={currentSrc}
            src={currentSrc}
            srcSet={!isLoading ? generateSrcSet() : undefined}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={alt}
            className={`
              w-full h-full transition-transform duration-300
              ${objectFit === 'cover' ? 'object-cover' : ''}
              ${objectFit === 'contain' ? 'object-contain' : ''}
              ${isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0'}
            `}
            loading={priority ? 'eager' : 'lazy'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptimizedImage;
