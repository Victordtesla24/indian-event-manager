import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Event } from "../types/event";
import { adminService } from "../services/adminService";
import { useToast } from "../contexts/ToastContext";
import {
  CalendarIcon,
  MapPinIcon as LocationMarkerIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const eventData = await adminService.getEventById(id || "");
      setEvent(eventData);
    } catch (error) {
      showToast("Failed to load event details", "error");
      navigate("/events");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          Event not found
        </h2>
        <p className="mt-2 text-gray-600">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/events")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg overflow-hidden rounded-xl">
        <div className="relative">
          {event.imageUrl && (
            <div className="h-[400px] w-full">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-8">
                <div className="max-w-3xl">
                  <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                  {event.marathi?.titleInMarathi && (
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                      {event.marathi.titleInMarathi}
                    </h2>
                  )}
                  <div className="flex items-center space-x-4 text-gray-200">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <LocationMarkerIcon className="h-5 w-5 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-600">{event.description}</p>
                  {event.marathi?.descriptionInMarathi && (
                    <p className="text-gray-600 mt-4 font-marathi">{event.marathi.descriptionInMarathi}</p>
                  )}
                </div>
              </div>

              {event.marathi && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Cultural Information</h3>
                  <div className="bg-orange-50 rounded-lg p-6 space-y-4">
                    {event.marathi.culturalNotes && (
                      <div className="text-orange-800">{event.marathi.culturalNotes}</div>
                    )}
                    
                    {event.marathi.traditionalDress && (
                      <div className="flex items-center text-orange-800">
                        <span className="font-medium mr-2">Dress Code:</span>
                        {event.marathi.traditionalDress}
                      </div>
                    )}

                    {event.marathi.dietaryOptions && (
                      <div className="flex items-center text-orange-800">
                        <span className="font-medium mr-2">Food Options:</span>
                        {event.marathi.dietaryOptions === "veg" ? "Vegetarian Only" :
                         event.marathi.dietaryOptions === "non-veg" ? "Non-Vegetarian Available" :
                         "Both Vegetarian and Non-Vegetarian Options"}
                      </div>
                    )}

                    {event.marathi.poojaTimings && (
                      <div className="flex items-center text-orange-800">
                        <span className="font-medium mr-2">Pooja Timings:</span>
                        {event.marathi.poojaTimings}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Organizer</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  {event.organizer && (
                    <>
                      <h4 className="font-medium text-gray-900">{event.organizer.name}</h4>
                      {event.organizer.abn && (
                        <p className="text-sm text-gray-600 mt-1">ABN: {event.organizer.abn}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">{event.organizer.contact}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    ${event.price}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">per person</p>
                </div>

                {(event.familyDiscount?.enabled || event.membershipDiscount?.enabled) && (
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-green-800 mb-2">Available Discounts</h4>
                    {event.familyDiscount?.enabled && (
                      <p className="text-sm text-green-700 mb-2">
                        • {event.familyDiscount.discountPercentage}% off for {event.familyDiscount.threshold}+ people
                      </p>
                    )}
                    {event.membershipDiscount?.enabled && (
                      <p className="text-sm text-green-700">
                        • {event.membershipDiscount.discountPercentage}% off for members
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Availability</span>
                    <span>{event.capacity - (event.registrations || 0)} seats left</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Duration</span>
                    <span>{event.duration}</span>
                  </div>
                  <button
                    type="button"
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;
