import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/events/HeroCarousel';

const NavLinks = () => (
  <>
    <Link to="/all" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">All</Link>
    <Link to="/natak" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">Natak</Link>
    <Link to="/cinema" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">Cinema</Link>
    <Link to="/musicals" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">Musicals</Link>
    <Link to="/events" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">Events</Link>
    <Link to="/fun" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">Fun</Link>
    <Link to="/folk" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">Folk</Link>
  </>
);

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-red-600">
              Indian Event Manager
            </Link>
            <nav className="hidden md:flex space-x-8">
              <NavLinks />
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <button type="button" className="text-gray-700 hover:text-red-600">मराठी</button>
              <button type="button" className="text-gray-700 hover:text-red-600">English</button>
            </div>
            <button 
              type="button" 
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Menu">
                <title>Menu</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Mobile menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out absolute top-full left-0 right-0 bg-white shadow-lg ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="py-6">
              <nav className="flex flex-col space-y-4 px-6">
                <NavLinks />
              </nav>
              <div className="flex justify-center space-x-6 mt-6 pt-4 border-t border-gray-100">
                <button type="button" className="text-gray-700 hover:text-red-600 font-medium">मराठी</button>
                <button type="button" className="text-gray-700 hover:text-red-600 font-medium">English</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <HeroCarousel />
        
        <div className="w-full bg-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <section className="mb-16 md:mb-24">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">Promoted Natak</h2>
                <Link to="/natak" className="text-red-600 hover:text-red-700 uppercase text-sm font-semibold tracking-wide">SEE ALL</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <img 
                      src="/images/events/gettyimages-1735021730-612x612.jpg"
                      alt="Event"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-16 md:mb-24">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">Promoted Events</h2>
                <Link to="/events" className="text-red-600 hover:text-red-700 uppercase text-sm font-semibold tracking-wide">SEE ALL</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <img 
                      src="/images/events/gettyimages-1702362815-612x612.jpg"
                      alt="Event"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
