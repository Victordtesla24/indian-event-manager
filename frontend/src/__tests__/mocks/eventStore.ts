import { Event } from '../../types/event';
import { mockEvents } from './mockData';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

interface EventFilter {
  city?: string;
  language?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export const mockSetFilter = jest.fn((_filter: EventFilter) => {});
export const mockFetchEvents = jest.fn(() => Promise.resolve());

export const mockEventStore = {
  events: mockEvents,
  loading: false,
  error: null,
  filter: {},
  setFilter: mockSetFilter,
  fetchEvents: mockFetchEvents,
};

describe('Mock Event Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have valid store data', () => {
    expect(mockEventStore).toHaveProperty('events');
    expect(mockEventStore).toHaveProperty('loading');
    expect(mockEventStore).toHaveProperty('error');
    expect(mockEventStore).toHaveProperty('filter');
    expect(mockEventStore).toHaveProperty('setFilter');
    expect(mockEventStore).toHaveProperty('fetchEvents');
  });

  it('should provide mock events', () => {
    expect(Array.isArray(mockEventStore.events)).toBe(true);
    expect(mockEventStore.events.length).toBeGreaterThan(0);

    mockEventStore.events.forEach((event: Event) => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('venue');
      expect(event.venue).toHaveProperty('city');
      expect(event.venue).toHaveProperty('name');
      expect(event.venue).toHaveProperty('address');
    });
  });

  it('should provide mock functions', () => {
    expect(typeof mockSetFilter).toBe('function');
    expect(typeof mockFetchEvents).toBe('function');
  });

  it('should handle setFilter correctly', () => {
    const filter = { city: 'Mumbai' };
    mockEventStore.setFilter(filter);
    expect(mockSetFilter).toHaveBeenCalledWith(filter);
  });

  it('should handle fetchEvents correctly', async () => {
    await mockEventStore.fetchEvents();
    expect(mockFetchEvents).toHaveBeenCalled();
  });
});
