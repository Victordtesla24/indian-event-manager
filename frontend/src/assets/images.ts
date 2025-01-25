// Import images using Vite's dynamic import
const ganeshaImage = new URL('./ganesha1.jpeg', import.meta.url).href;
const peacockImage = new URL('./peacock1.avif', import.meta.url).href;

export const images = {
  ganesha: ganeshaImage,
  peacock: peacockImage
} as const;

export type ImageKey = keyof typeof images;

export const getImage = (key: ImageKey): string => images[key];

// Export URLs directly for convenience
export { ganeshaImage, peacockImage };
