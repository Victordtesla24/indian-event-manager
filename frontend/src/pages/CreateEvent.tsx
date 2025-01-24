import type { FC } from 'react';
import EventForm from '../components/events/EventForm';

const CreateEvent: FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>
      <EventForm />
    </div>
  );
};

export default CreateEvent;
