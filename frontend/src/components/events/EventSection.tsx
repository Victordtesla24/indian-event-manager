import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Event } from '../../stores/eventStore';
import EventCard from './EventCard';

interface EventSectionProps {
  title: string;
  events: Event[];
  seeAllLink: string;
}

const EventSection = ({ title, events, seeAllLink }: EventSectionProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <Link 
          to={seeAllLink} 
          className="text-red-600 hover:text-red-700 font-medium"
        >
          SEE ALL →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {events.map((event) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventSection;
