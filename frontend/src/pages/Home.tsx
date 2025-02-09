import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroCarousel from '../components/home/HeroCarousel';
import EventCard from '../components/events/EventCard';
import { useEventStore } from '../stores/eventStore';
import { Event } from '../types/event';

const EventSection = ({ title, path, events }: { title: string; path: string; events: Event[] }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
      <Link
        to={path}
        className="text-primary-600 hover:text-primary-700 text-sm font-semibold tracking-wide flex items-center group
          transition-colors duration-250 hover:gap-1"
      >
        <span>SEE ALL</span>
        <svg
          className="w-4 h-4 transform transition-transform duration-250 group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  </motion.section>
);

const Home = () => {
  const events = useEventStore((state) => state.events);
  const theatreEvents = events.filter((event) => event.category === 'natak').slice(0, 5);
  const promotedEvents = events.filter((event) => event.is_promoted).slice(0, 5);
  const cinemaEvents = events.filter((event) => event.category === 'cinema').slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroCarousel />
        
        <div className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Promoted Sections */}
            <div className="py-8 md:py-12 space-y-12 md:space-y-16">
              <EventSection title="Featured Theatre" path="/natak" events={theatreEvents} />
              <EventSection title="Trending Events" path="/events" events={promotedEvents} />
              <EventSection title="Cinema Highlights" path="/cinema" events={cinemaEvents} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
