import { create } from 'zustand';
import { EVENT_CATEGORIES } from '../utils/constants';

// Import and use the constants to avoid type-only import warning
const categories = EVENT_CATEGORIES;
export type Category = typeof categories[keyof typeof categories];

export interface Event {
  id: string;
  title: string;
  imageUrl: string;
  category: Category;
  date: string;
  location: string;
  city: string;
  language: string;
  description: string;
  organizers: {
    id: string;
    name: string;
    role: string;
  }[];
  sponsors: {
    id: string;
    name: string;
    logo: string;
    website?: string;
  }[];
  artists: {
    id: string;
    name: string;
    role: string;
    bio?: string;
    image?: string;
  }[];
  venue: {
    name: string;
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  ticketing?: {
    provider: string;
    url: string;
    priceRange: {
      min: number;
      max: number;
      currency: string;
    };
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
  setEvents: (events: Event[]) => void;
  setSelectedEvent: (event: Event | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  filterEventsByCategory: (category: Category | 'All') => Event[];
  getEventById: (id: string) => Event | undefined;
  getEventsByLocation: (location: string) => Event[];
  getEventsByCity: (city: string) => Event[];
  getEventsByLanguage: (language: string) => Event[];
  getUpcomingEvents: () => Event[];
  getEventsByStatus: (status: Event['status']) => Event[];
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,

  setEvents: (events) => set({ events }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  filterEventsByCategory: (category) => {
    const { events } = get();
    if (category === 'All') return events;
    return events.filter((event) => event.category === category);
  },

  getEventById: (id) => {
    const { events } = get();
    return events.find((event) => event.id === id);
  },

  getEventsByLocation: (location) => {
    const { events } = get();
    return events.filter((event) => event.location === location);
  },

  getEventsByCity: (city) => {
    const { events } = get();
    return events.filter((event) => event.city.toLowerCase() === city.toLowerCase());
  },

  getEventsByLanguage: (language) => {
    const { events } = get();
    return events.filter((event) => event.language.toLowerCase() === language.toLowerCase());
  },

  getUpcomingEvents: () => {
    const { events } = get();
    const now = new Date();
    return events
      .filter((event) => event.status === 'upcoming' && new Date(event.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  getEventsByStatus: (status) => {
    const { events } = get();
    return events.filter((event) => event.status === status);
  },
}));

export default useEventStore;
