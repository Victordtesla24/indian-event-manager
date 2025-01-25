import React, { useState } from 'react';
import type { IconBaseProps } from 'react-icons';
import { FaSearch, FaFilter, FaMapMarkerAlt } from 'react-icons/fa';

interface EventSearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: EventFilters) => void;
}

interface EventFilters {
  category?: string;
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

const EventSearchBar: React.FC<EventSearchBarProps> = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({});

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const updateFilter = (key: keyof EventFilters, value: Partial<EventFilters[keyof EventFilters]>) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const IconWrapper: React.FC<{
    Icon: React.ComponentType<IconBaseProps>;
    wrapperClassName?: string;
    iconClassName?: string;
    size?: number;
    color?: string;
  }> = ({ 
    Icon, 
    wrapperClassName, 
    iconClassName, 
    size = 18, 
    color, 
    ...props 
  }) => (
    <span className={wrapperClassName}>
      <Icon 
        {...props} 
        {...(iconClassName ? { className: iconClassName } : {})}
        size={size} 
        color={color} 
      />
    </span>
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto my-6">
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <div className="relative flex-grow">
          <label htmlFor="event-search" className="sr-only">
            Search for events
          </label>
          <input
            id="event-search"
            type="text"
            placeholder="Search for events, performances, or venues"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          />
          <IconWrapper 
            Icon={FaSearch}
            wrapperClassName="absolute left-3 top-1/2 transform -translate-y-1/2"
            iconClassName="text-gray-400"
          />
        </div>
        <button
          type="button"
          onClick={handleFilterToggle}
          className="ml-4 p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Toggle filters"
        >
          <IconWrapper 
            Icon={FaFilter}
            iconClassName={`text-lg ${isFilterOpen ? 'text-red-500' : 'text-gray-600'}`}
          />
        </button>
        <button
          type="submit"
          className="ml-4 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
          Search
        </button>
      </form>

      {isFilterOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category-select"
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Categories</option>
                <option value="natak">Natak</option>
                <option value="cinema">Cinema</option>
                <option value="musicals">Musicals</option>
                <option value="events">Events</option>
              </select>
            </div>
            <div>
              <label htmlFor="location-input" className="block text-sm font-medium text-gray-700 mb-2">
                <IconWrapper 
                  Icon={FaMapMarkerAlt} 
                  wrapperClassName="inline-block mr-2"
                />Location
              </label>
              <input
                id="location-input"
                type="text"
                placeholder="City or Venue"
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  id="start-date"
                  type="date"
                  onChange={(e) => updateFilter('dateRange', { 
                    ...filters.dateRange, 
                    start: new Date(e.target.value) 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  id="end-date"
                  type="date"
                  onChange={(e) => updateFilter('dateRange', { 
                    ...filters.dateRange, 
                    end: new Date(e.target.value) 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSearchBar;
