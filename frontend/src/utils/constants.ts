export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Indian Event Manager';
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || 'Book tickets for Natak, Cinema, Musicals, and more';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  EVENT_DETAILS: '/event/:id',
  CATEGORY: '/category/:category',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ADMIN: {
    DASHBOARD: '/admin',
    EVENTS: '/admin/events',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
  },
} as const;

export const EVENT_CATEGORIES = {
  ALL: 'All',
  NATAK: 'Natak',
  CINEMA: 'Cinema',
  MUSICALS: 'Musicals',
  EVENTS: 'Events',
  FUN: 'Fun',
  FOLK: 'Folk',
} as const;

export const LANGUAGES = {
  MARATHI: 'मराठी',
  ENGLISH: 'English',
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again later.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in.',
  REGISTER: 'Successfully registered.',
  LOGOUT: 'Successfully logged out.',
  UPDATE: 'Successfully updated.',
  DELETE: 'Successfully deleted.',
  CREATE: 'Successfully created.',
} as const;
