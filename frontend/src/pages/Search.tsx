import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEventStore } from '../stores/eventStore';
import { Event } from '../types/event';
import EventCard from '../components/events/EventCard';
import FilterDrawer from '../components/search/FilterDrawer';

const Search = () => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const events = useEventStore((state) => state.events);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Event['category'] | 'all'>('all');

  const query = searchParams.get('q')?.toLowerCase() || '';

  useEffect(() => {
    let results = events.filter((event) => {
      const matchesQuery = event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
      const matchesDate = !selectedDate || event.date.startsWith(selectedDate);
      
      return matchesQuery && matchesCategory && matchesPrice && matchesDate;
    });

    // Sort results
    results.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return a.price - b.price;
    });

    setFilteredEvents(results);
  }, [events, query, selectedCategory, priceRange, selectedDate, sortBy]);

  const categories: { value: Event['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'natak', label: 'Natak' },
    { value: 'cinema', label: 'Cinema' },
    { value: 'musical', label: 'Musicals' },
    { value: 'event', label: 'Events' },
    { value: 'fun', label: 'Fun' },
    { value: 'folk', label: 'Folk' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="w-full bg-white rounded-lg shadow-sm py-3 px-4 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Filters
          </button>
        </div>

        {/* Filters Sidebar (Desktop) */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-24">
            <div>
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Event['category'] | 'all')}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Date Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Filter Drawer (Mobile) */}
          <FilterDrawer
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Search Results
              <span className="text-gray-500 text-lg font-normal ml-2">
                ({filteredEvents.length} {filteredEvents.length === 1 ? 'result' : 'results'})
              </span>
            </h2>
            {query && (
              <p className="text-gray-600 mt-1">
                Showing results for "{query}"
              </p>
            )}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
