import { Event } from '../../types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Diwali Celebration',
    description: 'Annual Diwali festival celebration',
    date: new Date().toISOString(),
    venue: {
      id: 1,
      name: 'Cultural Center',
      city: 'Mumbai',
      address: '123 Festival Street',
      capacity: 500
    },
    language: 'Hindi',
    category: 'event',
    image_url: '/images/diwali.jpg',
    price: 49.99,
    status: 'PUBLISHED',
    duration: '3 hours',
    capacity: 500,
  },
  {
    id: '2',
    title: 'Holi Festival',
    description: 'Spring festival of colors',
    date: new Date().toISOString(),
    venue: {
      id: 2,
      name: 'City Park',
      city: 'Delhi',
      address: '456 Park Avenue',
      capacity: 1000
    },
    language: 'Hindi',
    category: 'event',
    image_url: '/images/holi.jpg',
    price: 39.99,
    status: 'PUBLISHED',
    duration: '4 hours',
    capacity: 1000,
  },
];

describe('mockData', () => {
  it('should have mock events defined', () => {
    expect(mockEvents).toBeDefined();
    expect(Array.isArray(mockEvents)).toBe(true);
  });
});
