import { useEffect, useState } from 'react';
import { useEventStore } from '../../stores/eventStore';
import { Event } from '../../types/event';
import EventCard from './EventCard';

interface CategoryPageProps {
  category: Event['category'];
  title: string;
}

const CategoryPage = ({ category, title }: CategoryPageProps) => {
  const events = useEventStore((state) => 
    state.events.filter(event => event.category === category)
  );
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return a.price - b.price;
  });

  const filteredEvents = sortedEvents.filter(event => {
    const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
    const matchesDate = !selectedDate || event.date.startsWith(selectedDate);
    return matchesPrice && matchesDate;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="date">Date</option>
              <option value="price">Price</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                min={0}
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                min={0}
              />
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
