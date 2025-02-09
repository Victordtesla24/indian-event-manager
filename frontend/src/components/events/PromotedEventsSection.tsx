import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../stores/eventStore';
import { EVENT_CATEGORIES, CATEGORY_LABELS } from '../../constants/categories';

const FEATURED_SECTIONS = [
  EVENT_CATEGORIES.NATAK,
  EVENT_CATEGORIES.CINEMA,
  EVENT_CATEGORIES.EVENTS,
] as const;

export default function PromotedEventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotedEvents = async () => {
      try {
        const response = await fetch('/api/v1/events/promoted');
        if (!response.ok) {
          throw new Error('Failed to fetch promoted events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotedEvents();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg mb-8" />
        ))}
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

  return (
    <div className="space-y-12">
      {FEATURED_SECTIONS.map((section) => {
        const sectionEvents = events.filter((event) => event.category === section);

        if (sectionEvents.length === 0) return null;

        return (
          <section key={section}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {CATEGORY_LABELS[section]}
              </h2>
              <Link
                to={`/${section}`}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                View all
                <span aria-hidden="true"> →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
              {sectionEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="aspect-w-3 aspect-h-2 bg-gray-200 sm:aspect-none sm:h-48">
                    <img
                      src={event.imageUrl || '/images/event-placeholder.jpg'}
                      alt={event.title}
                      className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                    />
                  </div>
                  <div className="flex-1 p-4 space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{event.venue?.city || 'Location TBD'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
