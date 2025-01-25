import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useEventStore } from '../stores/eventStore';
import EventCard from '../components/events/EventCard';
import EventFilters, { type FilterState } from '../components/events/EventFilters';
import { motion, AnimatePresence } from 'framer-motion';

const Events = () => {
  const { category } = useParams<{ category?: string }>();
  const { events } = useEventStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: category as FilterState['category'] || 'All',
    city: '',
    language: '',
    startDate: '',
    endDate: '',
    searchQuery: ''
  });

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(loadingTimer);
  }, []);

  // Update category filter when URL param changes
  useEffect(() => {
    if (category) {
      setActiveFilters(prev => ({ ...prev, category: category as FilterState['category'] }));
    }
  }, [category]);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Apply search filter
    if (activeFilters.searchQuery) {
      const searchLower = activeFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.artists.some(artist => artist.name.toLowerCase().includes(searchLower)) ||
        event.organizers.some(org => org.name.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (activeFilters.category !== 'All') {
      filtered = filtered.filter(
        event => event.category === activeFilters.category
      );
    }

    // Apply city filter
    if (activeFilters.city) {
      filtered = filtered.filter(
        event => event.venue.city.toLowerCase() === activeFilters.city.toLowerCase()
      );
    }

    // Apply language filter
    if (activeFilters.language) {
      filtered = filtered.filter(
        event => event.language.toLowerCase() === activeFilters.language.toLowerCase()
      );
    }

    // Apply date range filter
    if (activeFilters.startDate) {
      const startDate = new Date(activeFilters.startDate);
      filtered = filtered.filter(
        event => new Date(event.date) >= startDate
      );
    }
    if (activeFilters.endDate) {
      const endDate = new Date(activeFilters.endDate);
      endDate.setHours(23, 59, 59); // Include the entire end date
      filtered = filtered.filter(
        event => new Date(event.date) <= endDate
      );
    }

    // Sort events by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [events, activeFilters]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setActiveFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category ? `${category} Events` : 'All Events'}
          </h1>
          <p className="text-gray-600">
            Discover and book amazing events in your area
          </p>
        </div>

        {/* Filters */}
        <EventFilters onFiltersChange={handleFiltersChange} />

        {/* Events Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {[
                'top-left',
                'top-center-left',
                'top-center-right',
                'top-right',
                'bottom-left',
                'bottom-center-left',
                'bottom-center-right',
                'bottom-right'
              ].map((position) => (
                <div
                  key={`skeleton-${position}`}
                  className="bg-white rounded-lg shadow-md h-64 animate-pulse"
                  role="status"
                  aria-label={`Loading event card - ${position} position`}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.3,
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredEvents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="img"
                  >
                    <title>No Events Found Icon</title>
                    <desc>A sad face icon indicating no events were found</desc>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                    No events found
                  </h2>
                  <p className="text-gray-500">
                    Try adjusting your filters or check back later for new events
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Events;
