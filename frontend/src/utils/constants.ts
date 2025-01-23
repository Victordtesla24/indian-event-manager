// Event types
export const EVENT_TYPES = [
  'Cultural',
  'Music',
  'Dance',
  'Theatre',
  'Food & Cuisine',
  'Literature',
  'Art',
  'Education',
  'Community',
] as const;

// Cities
export const CITIES = [
  'melbourne',
  'sydney',
] as const;

// Routes
export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

// Placeholder image with Indian cultural gradient
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg width="600" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF9933;stop-opacity:1"/%3E%3Cstop offset="50%25" style="stop-color:%23800000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23B01E23;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grad)"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle"%3EEvent Image%3C/text%3E%3C/svg%3E';
