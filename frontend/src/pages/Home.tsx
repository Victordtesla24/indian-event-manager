import Navigation from '../components/layout/Navigation';
import HeroCarousel from '../components/events/HeroCarousel';
import EventSection from '../components/events/EventSection';

// Mock data for testing
const mockNatakEvents = [
  {
    id: '1',
    title: 'Classical Drama',
    imageUrl: '/images/banners/ganesha1.jpeg',
    link: '/events/natak1'
  },
  {
    id: '2',
    title: 'Modern Theatre',
    imageUrl: '/images/banners/peacock1.avif',
    link: '/events/natak2'
  },
  {
    id: '3',
    title: 'Folk Performance',
    imageUrl: '/images/banners/ganesha1.jpeg',
    link: '/events/natak3'
  },
  {
    id: '4',
    title: 'Street Play',
    imageUrl: '/images/banners/peacock1.avif',
    link: '/events/natak4'
  },
  {
    id: '5',
    title: 'Traditional Drama',
    imageUrl: '/images/banners/ganesha1.jpeg',
    link: '/events/natak5'
  }
];

const mockCinemaEvents = [
  {
    id: '6',
    title: 'Bollywood Premier',
    imageUrl: '/images/banners/peacock1.avif',
    link: '/events/cinema1'
  },
  {
    id: '7',
    title: 'Art House Film',
    imageUrl: '/images/banners/ganesha1.jpeg',
    link: '/events/cinema2'
  },
  {
    id: '8',
    title: 'Regional Cinema',
    imageUrl: '/images/banners/peacock1.avif',
    link: '/events/cinema3'
  },
  {
    id: '9',
    title: 'Documentary',
    imageUrl: '/images/banners/ganesha1.jpeg',
    link: '/events/cinema4'
  },
  {
    id: '10',
    title: 'Short Film Festival',
    imageUrl: '/images/banners/peacock1.avif',
    link: '/events/cinema5'
  }
];

const mockMusicalEvents = [
  {
    id: '11',
    title: 'Classical Concert',
    imageUrl: '/images/banners/ganesha1.jpeg',
    link: '/events/musical1'
  },
  {
    id: '12',
    title: 'Folk Music Night',
    imageUrl: '/images/banners/peacock1.avif',
    link: '/events/musical2'
  },
  {
    id: '13',
    title: 'Fusion Performance',
    imageUrl: '/images/banners/ganesha1.jpeg',
    link: '/events/musical3'
  },
  {
    id: '14',
    title: 'Rock Concert',
    imageUrl: '/images/banners/peacock1.avif',
    link: '/events/musical4'
  },
  {
    id: '15',
    title: 'Jazz Evening',
    imageUrl: '/images/banners/ganesha1.jpeg',
    link: '/events/musical5'
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Carousel */}
      <div className="mb-4">
        <HeroCarousel />
      </div>

      {/* Event Sections */}
      <div className="space-y-2">
        <EventSection
          title="Promoted Natak"
          events={mockNatakEvents}
          seeAllLink="/events/natak"
        />
        
        <EventSection
          title="Promoted Cinema"
          events={mockCinemaEvents}
          seeAllLink="/events/cinema"
        />
        
        <EventSection
          title="Promoted Musicals"
          events={mockMusicalEvents}
          seeAllLink="/events/musicals"
        />
      </div>

      {/* Language Selection */}
      <div className="max-w-[1400px] mx-auto">
        <div className="py-6 text-center border-t border-gray-200 mt-6 px-4">
          <h3 className="text-gray-600 text-lg mb-3">भाषा निवडा / Select Language</h3>
          <div className="space-x-6">
            <button
              type="button"
              className="text-orange-600 hover:text-orange-700 text-lg font-medium"
              aria-label="Switch to Hindi language"
            >
              हिंदी
            </button>
            <button
              type="button"
              className="text-orange-600 hover:text-orange-700 text-lg font-medium"
              aria-label="Switch to English language"
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
