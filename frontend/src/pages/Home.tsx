import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE } from '../utils/constants';

const Home = () => {
  const featuredEvents = [
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
  ];

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-peacock-lime-light via-peacock-teal-light to-peacock-blue-light opacity-30" />
        <div className="absolute inset-0 bg-geometric-pattern opacity-40" />
        <div className="absolute inset-0 bg-peacock-feather bg-no-repeat bg-[length:800px_800px] bg-center opacity-20" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-peacock-indigo">
              Discover Indian Cultural Events
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Connect with your community through events in Melbourne and Sydney
            </p>
            <Link 
              to="/events"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-geometric-pattern opacity-30" />
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center text-peacock-blue mb-12">
            Featured Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredEvents.map((event, index) => (
              <div 
                key={event.id}
                className="card group relative bg-white/90 backdrop-blur-sm overflow-hidden p-0"
              >
                <div className="absolute inset-0 bg-geometric-pattern opacity-30" />
                <div className="absolute inset-0 bg-peacock-feather bg-no-repeat bg-[length:300px_300px] bg-center opacity-20" />
                <div className="aspect-video overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-70 ${
                    index === 0
                      ? 'from-peacock-lime-light via-peacock-teal-light to-peacock-blue-light'
                      : 'from-peacock-teal-light via-peacock-blue-light to-peacock-indigo-light'
                  }`} />
                  <img
                    src={event.imageUrl}
                    alt={`Event cover for ${event.title}`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 
                      group-hover:scale-105 transition-all duration-300 mix-blend-overlay"
                  />
                </div>
                <div className="p-6 relative">
                  <h3 className="text-2xl font-bold mb-3 text-peacock-blue group-hover:text-peacock-indigo transition-colors">
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
          <div className="text-center mt-12">
            <Link 
              to="/events"
              className="btn-secondary inline-block"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-peacock-lime-light via-peacock-teal-light to-peacock-blue-light opacity-30" />
        <div className="absolute inset-0 bg-geometric-pattern opacity-40" />
        <div className="absolute inset-0 bg-peacock-feather bg-no-repeat bg-[length:400px_400px] bg-center opacity-20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-peacock-indigo mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Create an account to stay updated on upcoming events and connect with the Indian community.
            </p>
            <Link 
              to="/register"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
