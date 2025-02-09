import { create } from 'zustand';
import type { Event } from '../types/event';
export type { Event };
import mockEvents from '../data/mockEvents';

export type Category = 'natak' | 'cinema' | 'musical' | 'event' | 'fun' | 'folk';

export interface EventFilter {
  city?: string;
  language?: string;
  category?: Category;
  startDate?: string;
  endDate?: string;
}

export interface EventStore {
  events: Event[];
  loading: boolean;
  error: string | null;
  filter: EventFilter;
  setFilter: (filter: EventFilter) => void;
  fetchEvents: () => Promise<void>;
}

export const useEventStore = create<EventStore>((set) => ({
  events: mockEvents, // Initialize with mock data
  loading: false,
  error: null,
  filter: {},
  setFilter: (filter) => set({ filter }),
  fetchEvents: async () => {
    // In a real app, this would fetch from an API
    // For now, we just simulate a delay
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch events', loading: false });
    }
  },
}));
