import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE } from '../utils/constants';

const Events = () => {
  const [events] = useState([
    {
      id: '1',
      title: 'Diwali Celebrations 2025',
      description: 'Join us for the festival of lights with cultural performances, food, and fireworks.',
      date: '2025-11-12',
      location: 'Melbourne Convention Centre',
      imageUrl: PLACEHOLDER_IMAGE,
    },
    {
      id: '2',
      title: 'Classical Music Night',
      description: 'An evening of Indian classical music featuring renowned artists.',
      date: '2025-02-15',
      location: 'Sydney Opera House',
      imageUrl: PLACEHOLDER_IMAGE,
    },
    {
      id: '3',
      title: 'Bollywood Dance Workshop',
      description: 'Learn popular Bollywood dance moves with professional choreographers.',
      date: '2025-03-20',
      location: 'Dance Studio Melbourne',
      imageUrl: PLACEHOLDER_IMAGE,
    },
  ]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center hero-container p-8 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-peacock-indigo">
              Upcoming Events
            </h1>
            <p className="text-xl text-gray-700">
              Discover and join amazing Indian cultural events in your city
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div 
                key={event.id}
                className="transparent-container overflow-hidden rounded-lg transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="aspect-video overflow-hidden relative">
                  <div className={index % 2 === 0 
                    ? 'absolute inset-0 bg-gradient-to-br opacity-70 from-peacock-lime-light via-peacock-teal-light to-peacock-blue-light'
                    : 'absolute inset-0 bg-gradient-to-br opacity-70 from-peacock-teal-light via-peacock-blue-light to-peacock-indigo-light'
                  } />
                  <img
                    src={event.imageUrl}
                    alt={`Event cover for ${event.title}`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 
                      transition-all duration-300 mix-blend-overlay"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-peacock-blue">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {event.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        role="img"
                      >
                        <title>Calendar</title>
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                      {new Date(event.date).toLocaleDateString('en-AU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center">
                      <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        role="img"
                      >
                        <title>Location</title>
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                      {event.location}
                    </span>
                  </div>
                  <Link 
                    to={`/events/${event.id}`}
                    className="mt-6 btn-primary w-full inline-block text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
