import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEventStore } from '../../stores/eventStore';
import useLanguageStore from '../../stores/languageStore';
import EventCard from './EventCard';

const promotedSections = ['Natak', 'Events', 'Cinema'] as const;
type PromotedSection = typeof promotedSections[number];

const PromotedEventsSection = () => {
  const { events } = useEventStore();
  const { getTranslation } = useLanguageStore();

  const filterEvents = (section: PromotedSection) => 
    events
      .filter(event => event.category === section)
      .slice(0, 5);

  return (
    <>
      {promotedSections.map((section) => (
        <div key={section} className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {getTranslation(section, 'categories')}
            </h2>
            <Link 
              to={`/category/${section.toLowerCase()}`} 
              className="text-red-600 hover:text-red-700 font-medium"
            >
              {getTranslation('seeAll', 'buttons')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {filterEvents(section).map((event) => (
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
      ))}
    </>
  );
};

export default PromotedEventsSection;
