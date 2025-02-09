import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../common/SearchBar';

const Header = () => {
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: { en: 'All', mr: 'सर्व' }, path: '/' },
    { name: { en: 'Natak', mr: 'नाटक' }, path: '/natak' },
    { name: { en: 'Cinema', mr: 'सिनेमा' }, path: '/cinema' },
    { name: { en: 'Musical', mr: 'संगीत' }, path: '/musical' },
    { name: { en: 'Events', mr: 'कार्यक्रम' }, path: '/events' },
    { name: { en: 'Fun', mr: 'मनोरंजन' }, path: '/fun' },
    { name: { en: 'Folk', mr: 'लोक' }, path: '/folk' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`bg-white fixed w-full top-0 z-50 transition-all duration-250 ${
        isScrolled ? 'shadow-header-scroll' : 'shadow-header'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-saffron-500 to-primary-600 rounded-lg transform transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-display text-lg font-bold">IE</span>
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-saffron-500 to-primary-600 bg-clip-text text-transparent transform transition-all duration-300 group-hover:tracking-wide">
              Indian Event Manager
            </span>
          </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group inline-flex items-center px-1 pt-1 text-sm h-full transition-all duration-250
                  ${
                    isActive(item.path)
                      ? 'text-primary-600 font-semibold'
                      : 'text-gray-600 hover:text-primary-600 font-medium'
                  }
                  relative overflow-hidden`}
              >
                {/* Hover line effect */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-transform duration-300 
                  ${isActive(item.path) 
                    ? 'bg-primary-600 scale-x-100' 
                    : 'bg-primary-300 scale-x-0 group-hover:scale-x-100'
                  }`} 
                />
                
                {/* Text with hover lift effect */}
                <span 
                  className={`${language === 'mr' ? 'font-marathi' : ''} 
                    transform transition-transform duration-300 group-hover:-translate-y-0.5`}
                >
                  {item.name[language]}
                </span>
              </Link>
            ))}
          </nav>

          {/* Search, Language, and Auth */}
          <div className="hidden md:flex items-center space-x-6">
            <SearchBar />
            <div className="h-6 w-px bg-gradient-to-b from-gray-200 to-gray-300" />
            <Link 
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-all duration-250 
                hover:-translate-y-0.5 hover:shadow-sm px-4 py-2 rounded-md"
            >
              Login
            </Link>
              <div className="relative group">
                <div className="text-xs text-gray-500 absolute -top-4 left-0 right-0 text-center whitespace-nowrap">
                  <span className="font-marathi">भाषा निवडा</span> / Select Language
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'mr')}
                  className="form-select appearance-none bg-white border-2 border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600
                    cursor-pointer transition-all duration-250 hover:border-primary-300
                    shadow-sm hover:shadow-md"
                >
                <option value="mr" className="font-marathi">मराठी</option>
                <option value="en">English</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-700">
                <svg className="h-4 w-4 transition-transform duration-250 group-hover:text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <SearchBar />
            <div className="h-5 w-px bg-gradient-to-b from-gray-200 to-gray-300" />
            <Link 
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-all duration-250
                hover:-translate-y-0.5 hover:shadow-sm px-3 py-1.5 rounded-md"
            >
              Login
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600/20 
                transition-all duration-250 hover:shadow-sm active:scale-95"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span
                  className={`absolute inset-0 transform transition-transform duration-250 ${
                    isMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                  } w-6 h-0.5 bg-current rounded-full`}
                />
                <span
                  className={`absolute inset-0 w-6 h-0.5 bg-current rounded-full transition-opacity duration-250 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute inset-0 transform transition-transform duration-250 ${
                    isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                  } w-6 h-0.5 bg-current rounded-full`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute top-16 right-0 w-72 bg-white/95 backdrop-blur-sm h-screen transform 
            transition-all duration-300 shadow-floating ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base transition-all duration-250 
                  transform hover:-translate-x-1 ${
                  isActive(item.path)
                    ? 'bg-primary-50 border-primary-600 text-primary-600 font-semibold'
                    : 'border-transparent text-gray-700 hover:bg-gray-50/80 hover:border-primary-300 hover:text-primary-600 font-medium'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={language === 'mr' ? 'font-marathi' : ''}>
                  {item.name[language]}
                </span>
              </Link>
            ))}
            {/* Language Selector */}
            <div className="pl-3 pr-4 py-2">
              <div className="text-xs text-gray-500 mb-1">
                भाषा निवडा / Select Language
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'mr')}
                className="form-select block w-full bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-base 
                  focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600
                  cursor-pointer transition-colors duration-250"
              >
                <option value="mr" className="font-marathi">मराठी</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
