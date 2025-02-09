// Environment variables
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';

// API URLs
export const API_URL = IS_DEV 
  ? 'http://localhost:8000/api/v1'
  : process.env.VITE_API_URL || 'https://api.ticketalay.com/api/v1';

// CDN URLs
export const CDN_URL = IS_DEV
  ? ''
  : process.env.VITE_CDN_URL || 'https://cdn.ticketalay.com';

// Auth
export const JWT_KEY = 'ticketalay_token';
export const REFRESH_KEY = 'ticketalay_refresh';

// Pagination
export const ITEMS_PER_PAGE = 20;
export const MAX_PAGES_SHOWN = 5;

// Image Dimensions
export const BANNER_DIMENSIONS = {
  desktop: { width: 4000, height: 1000 },
  mobile: { width: 2000, height: 1000 },
};

export const POSTER_DIMENSIONS = {
  width: 1000,
  height: 1500,
};

// Cache Duration (in seconds)
export const CACHE_DURATION = {
  events: 300, // 5 minutes
  categories: 3600, // 1 hour
  static: 86400, // 24 hours
};

// Feature Flags
export const FEATURES = {
  socialAuth: true,
  emailVerification: true,
  twoFactorAuth: false,
  analytics: true,
};

// Role Types
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  USER: 'user',
} as const;

// Event Categories
export const CATEGORIES = {
  NATAK: 'natak',
  CINEMA: 'cinema',
  MUSICAL: 'musical',
  EVENT: 'event',
  FUN: 'fun',
  FOLK: 'folk',
} as const;

// Languages
export const LANGUAGES = [
  { code: 'mr', name: 'मराठी', nameEn: 'Marathi' },
  { code: 'en', name: 'English', nameEn: 'English' },
] as const;

// Date Formats
export const DATE_FORMATS = {
  display: 'dd MMM yyyy',
  input: 'yyyy-MM-dd',
  api: 'yyyy-MM-dd\'T\'HH:mm:ssxxx',
};

// Error Messages
export const ERROR_MESSAGES = {
  default: 'Something went wrong. Please try again.',
  network: 'Unable to connect to server. Please check your internet connection.',
  unauthorized: 'Please login to continue.',
  forbidden: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  EVENT_VIEW: 'event_view',
  BOOKING_START: 'booking_start',
  BOOKING_COMPLETE: 'booking_complete',
  SEARCH: 'search',
  FILTER: 'filter',
  SHARE: 'share',
} as const;
