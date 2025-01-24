import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  event_date: string;
  event_type: string;
  status: string;
  organizer_id: string;
}

interface EventApprovalProps {
  limit?: number;
}

const EventApproval = ({ limit }: EventApprovalProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const response = await fetch(`/api/v1/events/pending${limit ? `?limit=${limit}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pending events');
      }
      const data = await response.json();
      // Sort events by date (most recent first)
      const sortedEvents = data.sort((a: Event, b: Event) => 
        new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
      );
      
      // Apply limit if provided
      const limitedEvents = limit ? sortedEvents.slice(0, limit) : sortedEvents;
      setEvents(limitedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    try {
      const response = await fetch(`/api/v1/events/${eventId}/approve`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to approve event');
      }
      // Remove the approved event from the list
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve event');
    }
  };

  const handleReject = async (eventId: string) => {
    try {
      const response = await fetch(`/api/v1/events/${eventId}/reject`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to reject event');
      }
      // Remove the rejected event from the list
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pending Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-500">No pending events to review.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow rounded-lg p-6 space-y-4"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{event.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Location:</span>{' '}
                  {event.location}, {event.city}
                </div>
                <div>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(event.event_date).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {event.event_type}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => handleReject(event.id)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(event.id)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventApproval;
