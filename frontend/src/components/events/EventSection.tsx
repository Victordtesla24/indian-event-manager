import { Link } from 'react-router-dom';
import EventCard from './EventCard';

interface Event {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

interface EventSectionProps {
  title: string;
  events: Event[];
  seeAllLink: string;
}

const EventSection = ({ title, events, seeAllLink }: EventSectionProps) => {
  return (
    <section className="py-4">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <Link
            to={seeAllLink}
            className="text-orange-600 hover:text-orange-700 text-base font-semibold uppercase"
          >
            SEE ALL
          </Link>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="sm:hidden -mx-4">
          <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">
            {events.map((event) => (
              <div key={event.id} className="w-[160px] flex-shrink-0">
                <EventCard
                  id={event.id}
                  title={event.title}
                  imageUrl={event.imageUrl}
                  link={event.link}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              imageUrl={event.imageUrl}
              link={event.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventSection;
