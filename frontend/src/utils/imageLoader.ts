// Function to get the correct public URL for images
export const getImageUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For development, use the base URL
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }
  
  // For production, use the full URL
  return new URL(`../public/${cleanPath}`, import.meta.url).href;
};

// Function to preload an image
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = getImageUrl(src);
  });
};

// Function to get a fallback image URL
export const getFallbackImageUrl = (): string => {
  return getImageUrl('images/banners/ganesha1.jpeg');
};

// Function to check if an image exists
export const checkImageExists = async (src: string): Promise<boolean> => {
  try {
    const response = await fetch(getImageUrl(src), { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
