import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import Events from '../../pages/Events';
import { mockEvents } from '../mocks/mockData';
import type { EventStore } from '../../stores/eventStore';

const mockStore = {
  events: mockEvents,
  loading: false,
  error: null,
  filter: {},
  setFilter: jest.fn(() => {}),
  fetchEvents: jest.fn(() => Promise.resolve())
} as EventStore;

// Mock the store module
jest.mock('../../stores/eventStore', () => ({
  useEventStore: jest.fn(() => mockStore)
}));

describe('Events Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders event list', async () => {
    render(<Events />);
    
    await screen.findByText(mockEvents[0].title);
    mockEvents.forEach((event) => {
      expect(screen.getByText(event.title)).toBeInTheDocument();
      expect(screen.getByText(event.description)).toBeInTheDocument();
    });
  });

  it('displays event details', async () => {
    render(<Events />);

    await screen.findByText(mockEvents[0].title);
    mockEvents.forEach((event) => {
      const eventTitle = screen.getByText(event.title);
      const eventCard = eventTitle.closest('div.bg-white') as HTMLElement;
      expect(eventCard).toBeInTheDocument();
      
      // Find city element within the event card if venue exists
      if (event.venue) {
        const cityElement = within(eventCard).getByText(event.venue.city);
        expect(cityElement).toBeInTheDocument();
      }
      
      // Find date element within the event card
      const dateElement = within(eventCard).getByText(new Date(event.date).toLocaleDateString());
      expect(dateElement).toBeInTheDocument();
    });
  });

});
