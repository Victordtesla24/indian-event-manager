const FALLBACK_IMAGE = '/images/events/default-event.svg';
const IMAGE_CACHE = new Map<string, string>();
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageLoadOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  category?: 'events' | 'sponsors' | 'banners';
}

export const getImageUrl = (path: string, category?: string): string => {
  if (!path) {
    console.warn('No image path provided, using fallback');
    return FALLBACK_IMAGE;
  }

  // Check cache first
  const cacheKey = `${path}-${category || ''}`;
  const cachedUrl = IMAGE_CACHE.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }

  let finalUrl: string;

  try {
    // Handle full URLs
    if (path.startsWith('http://') || path.startsWith('https://')) {
      finalUrl = path;
    }
    // Handle API-served images
    else if (path.startsWith('/api/')) {
      finalUrl = `${API_BASE_URL}${path}`;
    }
    // Handle absolute paths from public directory
    else if (path.startsWith('/images/')) {
      finalUrl = path;
    }
    // Handle static uploads directory
    else if (path.startsWith('/static/uploads/')) {
      finalUrl = `${API_BASE_URL}${path}`;
    }
    // Handle relative paths for different image categories
    else if (category) {
      finalUrl = `/images/${category}/${path}`;
    }
    // Handle base64 encoded images
    else if (path.startsWith('data:image/')) {
      finalUrl = path;
    }
    // Default to events directory
    else {
      finalUrl = `/images/events/${path}`;
    }

    // Validate URL
    new URL(finalUrl, window.location.origin);

    // Cache the resolved URL
    IMAGE_CACHE.set(cacheKey, finalUrl);
    return finalUrl;
  } catch (error) {
    console.error('Invalid image URL:', path, error);
    return FALLBACK_IMAGE;
  }
};

export const preloadImage = (src: string, category?: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!src) {
      console.warn('No image source provided for preloading');
      resolve();
      return;
    }

    const img = new Image();
    const timeout: NodeJS.Timeout = setTimeout(() => {
      cleanup();
      console.warn(`Image load timed out: ${src}, using fallback`);
      IMAGE_CACHE.set(src, FALLBACK_IMAGE);
      resolve();
    }, 10000); // 10 second timeout
    
    const cleanup = () => {
      clearTimeout(timeout);
      img.onload = null;
      img.onerror = null;
    };

    img.onload = () => {
      cleanup();
      // Cache successful loads
      IMAGE_CACHE.set(src, getImageUrl(src, category));
      resolve();
    };
    
    img.onerror = () => {
      cleanup();
      console.warn(`Failed to load image: ${src}, using fallback`);
      // Cache fallback for failed loads
      IMAGE_CACHE.set(src, FALLBACK_IMAGE);
      resolve();
    };
    
    img.src = getImageUrl(src, category);
  });
};

export const preloadImages = async (
  srcs: Array<{ src: string; category?: string }>
): Promise<void> => {
  try {
    await Promise.all(srcs.map(({ src, category }) => preloadImage(src, category)));
  } catch (error) {
    console.error('Failed to preload images:', error);
  }
};

export const getImageDimensions = async (
  src: string,
  category?: string
): Promise<ImageDimensions> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => {
      resolve({
        width: 300, // Default width
        height: 200 // Default height
      });
    };
    img.src = getImageUrl(src, category);
  });
};

export const getOptimizedImageUrl = async (
  path: string,
  options: ImageLoadOptions = {}
): Promise<string> => {
  if (!path) {
    console.warn('No image path provided for optimization');
    return FALLBACK_IMAGE;
  }

  try {
    const baseUrl = getImageUrl(path, options.category);
    // Don't optimize already optimized URLs
    if (baseUrl.includes('?') || baseUrl.startsWith('data:image/')) {
      return baseUrl;
    }

    const { quality = 80, format = 'webp' } = options;
    let { width, height } = options;

    // If dimensions aren't provided, try to get original dimensions
    if (!width || !height) {
      const dimensions = await getImageDimensions(path, options.category);
      width = width || dimensions.width;
      height = height || dimensions.height;
    }

    // Calculate responsive dimensions based on viewport
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 640) { // Mobile
      width = width ? Math.min(width, 320) : 320;
      height = height ? Math.min(height, 240) : 240;
    } else if (viewportWidth < 1024) { // Tablet
      width = width ? Math.min(width, 640) : 640;
      height = height ? Math.min(height, 480) : 480;
    }

    // For API-served images, use the API's optimization endpoint
    if (baseUrl.startsWith(API_BASE_URL)) {
      const optimizePath = '/api/v1/uploads/optimize';
      const params = new URLSearchParams({
        url: baseUrl,
        w: width?.toString() || '',
        h: height?.toString() || '',
        q: quality.toString(),
        fm: format
      });
      return `${API_BASE_URL}${optimizePath}?${params.toString()}`;
    }

    // For public directory images, use URL parameters
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality !== 80) params.append('q', quality.toString());
    if (format !== 'webp') params.append('fm', format);

    const optimizedUrl = `${baseUrl}?${params.toString()}`;
    
    // Cache the optimized URL
    const cacheKey = `${path}-${width}-${height}-${quality}-${format}`;
    IMAGE_CACHE.set(cacheKey, optimizedUrl);
    
    return optimizedUrl;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return getImageUrl(path, options.category); // Fall back to unoptimized URL
  }
};

// Export constants for components to use
export const FALLBACK_EVENT_IMAGE = FALLBACK_IMAGE;
export const FALLBACK_SPONSOR_IMAGE = '/images/sponsors/default-sponsor.svg';
export const FALLBACK_BANNER_IMAGE = '/images/banners/default-banner.svg';

// Clear image cache
export const clearImageCache = (): void => {
  IMAGE_CACHE.clear();
};
