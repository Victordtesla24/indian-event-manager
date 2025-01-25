import { motion } from 'framer-motion';
import useLanguageStore from '../../stores/languageStore';
import { LANGUAGES } from '../../utils/constants';

const languages = Object.values(LANGUAGES);

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
      {languages.map((lang) => (
        <motion.button
          key={lang}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full transition-colors ${
            language === lang 
              ? 'bg-red-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setLanguage(lang)}
          aria-label={`Switch to ${lang} language`}
        >
          {lang}
        </motion.button>
      ))}
    </div>
  );
};

export default LanguageSelector;
