import { useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/carousel.css';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  imageUrl: string;
  link: string;
  title: string;
  category: 'Natak' | 'Cinema' | 'Events' | 'Musicals' | 'Folk';
}

const mockEvents: Event[] = [
  {
    id: '1',
    imageUrl: '/images/events/gettyimages-552148883-612x612.jpg',
    link: '/event-details/1',
    title: 'Shikayala Gelo Ek!',
    category: 'Natak'
  },
  {
    id: '2',
    imageUrl: '/images/events/gettyimages-598995900-612x612.jpg',
    link: '/event-details/2',
    title: 'Jyachi Tyachi Love Story',
    category: 'Cinema'
  },
  {
    id: '3',
    imageUrl: '/images/events/gettyimages-603211052-612x612.jpg',
    link: '/event-details/3',
    title: 'Punha Sahi Re Sahi',
    category: 'Natak'
  }
];

const HeroCarousel = () => {
  const [events] = useState<Event[]>(mockEvents);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [language, setLanguage] = useState('English');

  const categories = ['All', 'Natak', 'Cinema', 'Musicals', 'Events', 'Fun', 'Folk'];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-4 w-full">
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <button
        type="button"
        className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
        aria-label={`Go to slide ${i + 1}`}
      />
    ),
  };

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <div className="relative w-full">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
        <button
          type="button"
          className={`px-4 py-2 rounded-full transition-colors ${
            language === 'Marathi' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'
          }`}
          onClick={() => setLanguage('Marathi')}
          aria-label="Switch to Marathi language"
        >
          मराठी
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-full transition-colors ${
            language === 'English' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'
          }`}
          onClick={() => setLanguage('English')}
          aria-label="Switch to English language"
        >
          English
        </button>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-sm overflow-x-auto">
        <div className="flex justify-center space-x-4 p-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === cat 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(cat)}
              aria-label={`Filter ${cat} events`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Carousel */}
      <Slider {...settings}>
        {events.map((event, index) => (
          <Link 
            key={event.id} 
            to={event.link}
            aria-label={`View details for ${event.title}`}
          >
            <div className="carousel-slide h-[70vh] md:h-[90vh] relative">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white max-w-xl">
                <h3 className="text-4xl font-bold mb-6 drop-shadow-lg">{event.title}</h3>
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full text-lg transform transition-all hover:scale-105"
                  aria-label={`Book now for ${event.title}`}
                >
                  Book Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </Slider>

      {/* Promoted Sections */}
      {['Natak', 'Events', 'Cinema'].map((section) => (
        <div key={section} className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Promoted {section}</h2>
            <Link 
              to={`/${section.toLowerCase()}`} 
              className="text-red-600 hover:text-red-700 font-medium"
            >
              SEE ALL →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {filteredEvents
              .filter(event => event.category === section || selectedCategory === 'All')
              .slice(0, 5)
              .map((event) => (
                <div 
                  key={event.id} 
                  className="group relative overflow-hidden rounded-lg shadow-lg"
                >
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-white font-semibold truncate">{event.title}</h3>
                    <button 
                      type="button"
                      className="text-white text-sm hover:underline"
                      aria-label={`View ${event.title}`}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;
