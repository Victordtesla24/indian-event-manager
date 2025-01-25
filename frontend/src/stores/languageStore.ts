import { create } from 'zustand';
import { LANGUAGES } from '../utils/constants';

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

interface Translation {
  [key: string]: {
    [key: string]: string;
  };
}

interface LanguageState {
  language: Language;
  translations: Translation;
  setLanguage: (language: Language) => void;
  getTranslation: (key: string, category?: string) => string;
}

const translations: Translation = {
  categories: {
    All: 'सर्व',
    Natak: 'नाटक',
    Cinema: 'सिनेमा',
    Musicals: 'संगीत',
    Events: 'कार्यक्रम',
    Fun: 'मनोरंजन',
    Folk: 'लोक',
  },
  buttons: {
    bookNow: 'आता बुक करा',
    seeAll: 'सर्व पहा',
    login: 'लॉग इन',
    register: 'नोंदणी करा',
    logout: 'बाहेर पडा',
  },
  labels: {
    date: 'तारीख',
    time: 'वेळ',
    location: 'स्थान',
    price: 'किंमत',
    seats: 'जागा',
  },
  messages: {
    welcome: 'स्वागत आहे',
    loading: 'लोड होत आहे...',
    error: 'काहीतरी चूक झाली',
    success: 'यशस्वी',
  },
};

const useLanguageStore = create<LanguageState>((set, get) => ({
  language: LANGUAGES.MARATHI,
  translations,
  setLanguage: (language) => set({ language }),
  getTranslation: (key, category = 'messages') => {
    const { language, translations } = get();
    if (language === LANGUAGES.ENGLISH) return key;

    const categoryTranslations = translations[category];
    if (!categoryTranslations) return key;

    return categoryTranslations[key] || key;
  },
}));

export default useLanguageStore;
