import { CDN_URL } from '../config';

// Image categories
export enum ImageCategory {
  BANNER = 'banner',
  POSTER = 'poster',
  PROFILE = 'profile',
  VENUE = 'venue',
}

// Image sizes
export enum ImageSize {
  THUMBNAIL = 'thumbnail',
  MEDIUM = 'medium',
  LARGE = 'large',
  ORIGINAL = 'original',
}

interface ImageOptions {
  size?: ImageSize;
  quality?: number;
  format?: 'jpg' | 'webp' | 'avif';
}

const defaultOptions: ImageOptions = {
  size: ImageSize.ORIGINAL,
  quality: 75,
  format: 'webp',
};

/**
 * Get optimized image URL
 */
export const getImageUrl = (path: string, options: ImageOptions = defaultOptions): string => {
  if (!path) return '/images/placeholder.jpg';
  
  // For development, use local images
  if (process.env.NODE_ENV === 'development') {
    return path.startsWith('/') ? path : `/images/${path}`;
  }

  // For production, use CDN
  const { size, quality, format } = { ...defaultOptions, ...options };
  return `${CDN_URL}/images/${size}/${path}?q=${quality}&fm=${format}`;
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = (paths: string[]) => {
  paths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getImageUrl(path, { size: ImageSize.LARGE });
    document.head.appendChild(link);
  });
};

/**
 * Generate responsive image srcSet
 */
export const generateSrcSet = (path: string, options: ImageOptions = defaultOptions): string => {
  const sizes = [
    { width: 640, size: ImageSize.THUMBNAIL },
    { width: 1024, size: ImageSize.MEDIUM },
    { width: 1920, size: ImageSize.LARGE },
    { width: 3840, size: ImageSize.ORIGINAL },
  ];

  return sizes
    .map(({ width, size }) => {
      const url = getImageUrl(path, { ...options, size });
      return `${url} ${width}w`;
    })
    .join(', ');
};

/**
 * Get image dimensions based on category
 */
export const getImageDimensions = (category: ImageCategory) => {
  switch (category) {
    case ImageCategory.BANNER:
      return { width: 4000, height: 1000 };
    case ImageCategory.POSTER:
      return { width: 1000, height: 1500 };
    case ImageCategory.PROFILE:
      return { width: 400, height: 400 };
    case ImageCategory.VENUE:
      return { width: 1920, height: 1080 };
    default:
      return { width: 800, height: 600 };
  }
};

/**
 * Check if image exists
 */
export const checkImageExists = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(getImageUrl(path), { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
