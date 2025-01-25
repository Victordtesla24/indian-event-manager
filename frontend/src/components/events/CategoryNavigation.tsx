import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import useLanguageStore from '../../stores/languageStore';
import type { Category } from '../../stores/eventStore';
import { EVENT_CATEGORIES } from '../../utils/constants';

const categories = Object.values(EVENT_CATEGORIES);

const CategoryNavigation = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const { getTranslation } = useLanguageStore();

  const handleCategoryClick = (cat: Category | 'All') => {
    if (cat === 'All') {
      navigate('/events');
    } else {
      navigate(`/category/${cat.toLowerCase()}`);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm overflow-x-auto">
      <div className="flex justify-center space-x-4 p-4">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full transition-all ${
              (category ? category.toLowerCase() === cat.toLowerCase() : cat === 'All')
                ? 'bg-red-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => handleCategoryClick(cat)}
            aria-label={`Filter ${cat} events`}
          >
            {getTranslation(cat, 'categories')}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;
