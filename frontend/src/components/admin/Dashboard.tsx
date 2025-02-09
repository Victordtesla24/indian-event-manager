import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEventStore, Event } from '../../stores/eventStore';
import Overview from './Overview';

export default function Dashboard() {
  const { events, loading, error, fetchEvents } = useEventStore((state) => ({
    events: state.events,
    loading: state.loading,
    error: state.error,
    fetchEvents: state.fetchEvents,
  }));

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg mb-8" />
        <div className="h-96 bg-gray-200 rounded-lg" />
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

  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      <Overview />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Upcoming Events</h2>
          <Link
            to="/admin/events"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            View all
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {upcomingEvents.slice(0, 5).map((event: Event) => (
              <li key={event.id}>
                <Link
                  to={`/events/${event.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={event.imageUrl || '/images/event-placeholder.jpg'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {event.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 truncate">
                            {event.venue ? `${event.venue.name}, ${event.venue.city}` : 'Location TBD'}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
