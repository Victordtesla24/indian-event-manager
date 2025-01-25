import { useState, useEffect } from 'react';
import { images } from '../../assets/images';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  width?: number;
  preload?: boolean;
}

const OptimizedImage = ({
  src,
  fallbackSrc = images.ganesha,
  width,
  preload = false,
  className = '',
  alt = '',
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadProgress(0);
        
        if (preload) {
          const img = new Image();
          img.src = src;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              setLoadProgress(100);
              resolve();
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
          });
        }
        
        setIsLoading(false);
        setLoadProgress(100);
      } catch (err) {
        console.error('Failed to load image:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src, preload]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={() => {
          setIsLoading(false);
          setLoadProgress(100);
        }}
        onError={() => {
          setError(new Error(`Failed to load image: ${src}`));
        }}
        {...props}
      />
      
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200"
          aria-busy="true"
          aria-label={`Loading ${alt}`}
        >
          <div
            className="h-1 bg-orange-600 transition-all duration-300"
            style={{ width: `${loadProgress}%` }}
            role="progressbar"
            aria-label={`Loading progress for ${alt}`}
            aria-valuenow={loadProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
          />
        </div>
      )}
      
      {error && !isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          role="alert"
          aria-label={`Failed to load image: ${alt}`}
        >
          <span className="text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
