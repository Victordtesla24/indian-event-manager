import { FC, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  city: string;
  event_type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  organizer: {
    id: string;
    full_name: string;
    email: string;
  };
}

const EventApproval: FC<{ limit?: number }> = ({ limit }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/v1/events/?status=PENDING', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pending events');
        }

        const data = await response.json();
        setEvents(limit ? data.slice(0, limit) : data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, limit]);

  const handleApproval = async (eventId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/v1/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event status');
      }

      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No pending events to approve
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white shadow rounded-lg p-4 border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{event.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
                <p>Location: {event.location}, {event.city}</p>
                <p>Type: {event.event_type}</p>
                <p>Organizer: {event.organizer.full_name}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleApproval(event.id, 'APPROVED')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproval(event.id, 'REJECTED')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventApproval;
