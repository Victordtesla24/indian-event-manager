import { useEffect } from 'react';
import { useEventStore } from '../stores/eventStore';

export default function Events() {
  const { events, loading, error, filter, setFilter, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div 
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
      </div>
    );
  }

  const filteredEvents = events.filter((event) => {
    if (filter.city && event.venue?.city !== filter.city) return false;
    if (filter.language && event.language !== filter.language) return false;
    if (filter.category && event.category !== filter.category) return false;
    if (filter.startDate && new Date(event.date) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(event.date) > new Date(filter.endDate)) return false;
    return true;
  });

  const cities = [...new Set(events.map((event) => event.venue?.city).filter(Boolean))];
  const languages = [...new Set(events.map((event) => event.language))];
  const categories = [...new Set(events.map((event) => event.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          name="city"
          onChange={handleFilterChange}
          value={filter.city || ''}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          aria-label="city"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          name="language"
          onChange={handleFilterChange}
          value={filter.language || ''}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          aria-label="language"
        >
          <option value="">All Languages</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>

        <select
          name="category"
          onChange={handleFilterChange}
          value={filter.category || ''}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          aria-label="category"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="startDate"
          onChange={handleFilterChange}
          value={filter.startDate || ''}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          aria-label="start date"
        />

        <input
          type="date"
          name="endDate"
          onChange={handleFilterChange}
          value={filter.endDate || ''}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          aria-label="end date"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <span>{event.venue?.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900">No events found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters to find more events
          </p>
        </div>
      )}
    </div>
  );
}
