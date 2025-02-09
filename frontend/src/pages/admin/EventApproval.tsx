import { useEffect, useState, useCallback } from 'react';
import { Event } from '../../stores/eventStore';

interface EventApprovalProps {
  onApprove: (eventId: number) => Promise<void>;
  onReject: (eventId: number) => Promise<void>;
}

export default function EventApproval({ onApprove, onReject }: EventApprovalProps) {
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingEvents = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/admin/events/pending');
      if (!response.ok) {
        throw new Error('Failed to fetch pending events');
      }
      const data = await response.json();
      setPendingEvents(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingEvents();
  }, [fetchPendingEvents]);

  const handleApprove = async (eventId: number) => {
    try {
      await onApprove(eventId);
      await fetchPendingEvents();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleReject = async (eventId: number) => {
    try {
      await onReject(eventId);
      await fetchPendingEvents();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg mb-4" />
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

  if (pendingEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">No pending events</h2>
        <p className="mt-2 text-sm text-gray-500">
          All events have been reviewed
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {event.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {event.description}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p>
                    Venue: {event.venue ? `${event.venue.name}, ${event.venue.city}` : 'Location TBD'}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleReject(parseInt(event.id, 10))}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(parseInt(event.id, 10))}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
