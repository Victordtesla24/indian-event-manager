import React from 'react';
import { Link } from 'react-router-dom';
import useLanguageStore from '../../stores/languageStore';

const Navbar: React.FC = () => {
  const { getTranslation } = useLanguageStore();

  const categories = [
    'All',
    'Natak',
    'Cinema',
    'Musicals',
    'Events',
    'Fun',
    'Folk'
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-red-600">
            Indian Event Manager
          </Link>
          
          <div className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {getTranslation(category, 'categories')}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
