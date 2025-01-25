import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'natak', name: 'Natak' },
  { id: 'cinema', name: 'Cinema' },
  { id: 'musicals', name: 'Musicals' },
  { id: 'events', name: 'Events' },
  { id: 'fun', name: 'Fun' },
  { id: 'folk', name: 'Folk' }
];

const Navigation = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center h-14">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-orange-600 py-2 sm:py-0 mr-8">
            EventsIndia
          </Link>

          {/* Navigation Categories */}
          <div className="flex flex-wrap sm:flex-nowrap gap-6 sm:gap-8 h-full">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`h-full px-1 text-sm transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'border-b-2 border-orange-500 text-gray-900 font-medium'
                    : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveCategory(category.id)}
                aria-label={`Show ${category.name} events`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu - hidden on desktop */}
      <div className="sm:hidden border-t border-gray-100">
        <div className="grid grid-cols-3 gap-1 p-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                activeCategory === category.id
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveCategory(category.id)}
              aria-label={`Show ${category.name} events`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
