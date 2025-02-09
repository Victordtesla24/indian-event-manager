import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../stores/eventStore';
import { EVENT_CATEGORIES } from '../constants/categories';

type EventFormData = Omit<Event, 'id'> & {
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
  };
};

const initialFormData: EventFormData = {
  title: '',
  description: '',
  date: '',
  imageUrl: '',
  venue: {
    id: 0,
    name: '',
    address: '',
    city: '',
    capacity: 0
  },
  category: EVENT_CATEGORIES.EVENTS,
  language: '',
  price: 0,
  status: 'DRAFT',
  duration: '',
  capacity: 0,
};

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    parent?: 'venue'
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (parent === 'venue') {
        return {
          ...prev,
          venue: {
            ...prev.venue,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value,
          },
        };
      }
      
      // Handle numeric fields
      if (name === 'price' || name === 'capacity') {
        return {
          ...prev,
          [name]: parseFloat(value) || 0,
        };
      }
      
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const data = await response.json();
      navigate(`/events/${data.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Create New Event</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {Object.values(EVENT_CATEGORIES).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  id="language"
                  required
                  value={formData.language}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (AUD)
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  id="duration"
                  required
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 2 hours"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Venue Details</h3>
                <div>
                  <label htmlFor="venue-name" className="block text-sm font-medium text-gray-700">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="venue-name"
                    required
                    value={formData.venue.name}
                    onChange={(e) => handleChange(e, 'venue')}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="venue-city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="venue-city"
                    required
                    value={formData.venue.city}
                    onChange={(e) => handleChange(e, 'venue')}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="venue-address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="venue-address"
                    required
                    value={formData.venue.address}
                    onChange={(e) => handleChange(e, 'venue')}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="venue-capacity" className="block text-sm font-medium text-gray-700">
                    Venue Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    id="venue-capacity"
                    min="1"
                    required
                    value={formData.venue.capacity}
                    onChange={(e) => handleChange(e, 'venue')}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/events')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
