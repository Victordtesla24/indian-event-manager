import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm, { type Event } from '../components/events/EventForm';

const CreateEvent: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (eventData: Event) => {
    try {
      const response = await fetch('/api/v1/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      navigate('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateEvent;
