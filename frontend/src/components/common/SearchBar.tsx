import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-600 hover:text-primary-600 focus:outline-none transition-all duration-250
            rounded-full hover:bg-gray-100/80 hover:scale-110 active:scale-95"
          aria-label="Toggle search"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <div
          className={`absolute right-0 top-full mt-2 transition-all duration-300 ${
            isExpanded
              ? 'opacity-100 visible translate-y-0 scale-100'
              : 'opacity-0 invisible -translate-y-2 scale-95'
          }`}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-64 px-4 py-2 border-2 border-gray-200 rounded-xl shadow-elevated
              focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600
              bg-white/95 backdrop-blur-sm placeholder-gray-400 text-sm
              transition-all duration-250 hover:shadow-floating
              hover:border-primary-300"
            onBlur={() => {
              if (!searchQuery) {
                setIsExpanded(false);
              }
            }}
            autoFocus={isExpanded}
          />
        </div>
      </form>

      {/* Search Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden transition-all duration-300 ${
          isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsExpanded(false)}
      >
        <div
          className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-floating p-4 
            animate-scale-up border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600
              bg-white/80 placeholder-gray-400 text-base
              transition-all duration-250 hover:border-primary-300"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-primary-600 
              transition-all duration-250 p-2 rounded-full hover:bg-gray-100/80
              hover:scale-110 active:scale-95"
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
      </div>
    </div>
  );
};

export default SearchBar;
