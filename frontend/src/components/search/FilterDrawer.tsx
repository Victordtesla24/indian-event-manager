import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '../../types/event';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: Event['category'] | 'all';
  onCategoryChange: (category: Event['category'] | 'all') => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  sortBy: 'date' | 'price';
  onSortChange: (sort: 'date' | 'price') => void;
}

const FilterDrawer = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedDate,
  onDateChange,
  sortBy,
  onSortChange,
}: FilterDrawerProps) => {
  const categories: { value: Event['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'natak', label: 'Natak' },
    { value: 'cinema', label: 'Cinema' },
    { value: 'musical', label: 'Musicals' },
    { value: 'event', label: 'Events' },
    { value: 'fun', label: 'Fun' },
    { value: 'folk', label: 'Folk' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Filters</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value as Event['category'] | 'all')}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as 'date' | 'price')}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="date">Date</option>
                    <option value="price">Price</option>
                  </select>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={onClose}
                className="w-full mt-8 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterDrawer;
