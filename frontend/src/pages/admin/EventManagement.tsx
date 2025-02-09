import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import {
  CalendarIcon,
  MapPinIcon as LocationMarkerIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import { Event } from "../../types/event";
import EventForm from "../../components/events/EventForm";

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await adminService.getEvents();
      setEvents(data);
    } catch (error) {
      showToast("Failed to load events", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all events including their title, date, location, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleCreateEvent}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            Add event
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            {event.imageUrl && (
              <div className="h-48 w-full">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {event.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    event.status
                  )}`}
                >
                  {event.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {event.description}
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <LocationMarkerIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                  {event.registrations} / {event.capacity} registered
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <button
                onClick={() => handleEditEvent(event)}
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Edit event
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedEvent ? "Edit Event" : "Create Event"}
            </h2>
            <EventForm
              event={selectedEvent}
              onSubmit={async (data) => {
                try {
                  if (selectedEvent) {
                    await adminService.updateEvent(selectedEvent.id, data);
                    showToast("Event updated successfully", "success");
                  } else {
                    await adminService.createEvent(data);
                    showToast("Event created successfully", "success");
                  }
                  setIsModalOpen(false);
                  loadEvents();
                } catch (error) {
                  showToast("Failed to save event", "error");
                }
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
