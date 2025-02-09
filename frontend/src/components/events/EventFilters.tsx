import { useState, useEffect } from 'react';
import { useEventStore } from '../../stores/eventStore';
type Category = 'natak' | 'cinema' | 'musical' | 'event' | 'fun' | 'folk';
import { EVENT_CATEGORIES, CATEGORY_LABELS } from '../../constants/categories';

interface EventFiltersProps {
  onFilterChange: (filters: {
    category: Category | 'all';
    city: string;
    language: string;
  }) => void;
}

export default function EventFilters({ onFilterChange }: EventFiltersProps) {
  const events = useEventStore((state) => state.events);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  useEffect(() => {
    const cities = [...new Set(events.map((event) => event.venue?.city).filter((city): city is string => Boolean(city)))].sort();
    const languages = [...new Set(events.map((event) => event.language).filter((lang): lang is string => Boolean(lang)))].sort();
    setAvailableCities(cities);
    setAvailableLanguages(languages);
  }, [events]);

  const handleCategoryChange = (category: Category | 'all') => {
    setSelectedCategory(category);
    onFilterChange({
      category,
      city: selectedCity,
      language: selectedLanguage,
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onFilterChange({
      category: selectedCategory,
      city,
      language: selectedLanguage,
    });
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    onFilterChange({
      category: selectedCategory,
      city: selectedCity,
      language,
    });
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value as Category | 'all')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All Categories</option>
          {Object.values(EVENT_CATEGORIES).map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <select
          id="city"
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Cities</option>
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Language
        </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Languages</option>
          {availableLanguages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
