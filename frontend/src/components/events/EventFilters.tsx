import { useState, useEffect } from 'react';
import { useEventStore, type Category } from '../../stores/eventStore';
import { EVENT_CATEGORIES } from '../../utils/constants';

export interface FilterState {
  category: Category | 'All';
  city: string;
  language: string;
  startDate: string;
  endDate: string;
  searchQuery: string;
}

interface EventFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ onFiltersChange }) => {
  const { events } = useEventStore();
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    city: '',
    language: '',
    startDate: '',
    endDate: '',
    searchQuery: ''
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  // Extract unique cities and languages from events
  useEffect(() => {
    const extractLocations = () => {
      if (events.length > 0) {
        const cities = [...new Set(events.map(event => event.venue.city))].sort();
        const languages = [...new Set(events.map(event => event.language))].sort();
        setAvailableCities(cities);
        setAvailableLanguages(languages);
      } else {
        setAvailableCities([]);
        setAvailableLanguages([]);
      }
    };

    extractLocations();
  }, [events]); // Depend on the entire events array to catch all changes

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { 
      ...filters, 
      [key]: key === 'category' ? (value as Category | 'All') : value 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      category: 'All',
      city: '',
      language: '',
      startDate: '',
      endDate: '',
      searchQuery: ''
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search Input */}
        <div className="col-span-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Search Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="All">All Categories</option>
            {Object.values(EVENT_CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            id="city"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            id="language"
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Languages</option>
            {availableLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filters */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Clear Filters Button */}
        <div className="col-span-full flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
