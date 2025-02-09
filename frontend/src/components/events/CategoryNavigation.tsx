import { Link } from 'react-router-dom';
import { Category } from '../../stores/eventStore';
import { CATEGORY_LABELS, CATEGORY_LIST } from '../../constants/categories';

interface CategoryNavigationProps {
  activeCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

export default function CategoryNavigation({
  activeCategory,
  onCategoryChange,
}: CategoryNavigationProps) {
  const handleCategoryClick = (category: Category | 'all') => {
    onCategoryChange(category);
  };

  return (
    <nav className="flex space-x-4 overflow-x-auto pb-4">
      {CATEGORY_LIST.map((category) => (
        <Link
          key={category}
          to={category === 'all' ? '/events' : `/${category}`}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            activeCategory === category
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category === 'all' ? 'All Events' : CATEGORY_LABELS[category as Category]}
        </Link>
      ))}
    </nav>
  );
}
