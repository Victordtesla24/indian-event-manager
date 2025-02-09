import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/adminService";
import { Event } from "../types/event";
import { useToast } from "../contexts/ToastContext";
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  UsersIcon as SearchIcon,
  Bars3Icon as FilterIcon,
  BanknotesIcon as CurrencyIcon,
} from "@heroicons/react/24/outline";

const EventDiscovery = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const categories = [
    "All",
    "Natak",
    "Cinema",
    "Musicals",
    "Events",
    "Fun",
    "Folk"
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await adminService.getEvents();
      setEvents(data.filter(event => event.status === "PUBLISHED"));
    } catch (error) {
      showToast("Failed to load events", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location ? event.location.toLowerCase().includes(searchTerm.toLowerCase()) : false);
    
    const matchesCategory = !selectedCategory || selectedCategory === "All" || 
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filter */}
      {/* Categories */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-lg font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? "text-primary-600 border-b-2 border-primary-600 -mb-px pb-4"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-primary-500 focus:border-primary-500 shadow-sm"
          />
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Event Grid */}
      {/* Featured Events Carousel */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              {event.imageUrl && (
                <div className="h-64 relative">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">
                      {event.title}
                    </h3>
                    {event.marathi?.titleInMarathi && (
                      <p className="text-sm text-gray-200 mt-1">
                        {event.marathi.titleInMarathi}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    ${event.price}
                  </div>
                </div>
                <button
                  className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/events/${event.id}`);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Events */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            {event.imageUrl && (
              <div className="h-48">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">
                {event.title}
              </h3>
              {event.marathi?.titleInMarathi && (
                <p className="text-sm text-gray-600">
                  {event.marathi.titleInMarathi}
                </p>
              )}
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-primary-600">
                  ${event.price}
                </div>
                <button
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/events/${event.id}`);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EventDiscovery;
