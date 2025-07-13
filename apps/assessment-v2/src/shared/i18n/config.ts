import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslations from './locales/es.json';
import enTranslations from './locales/en.json';

// Default language is Spanish for LATAM/Spain focus
const DEFAULT_LANGUAGE = 'es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: esTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: 'es', // Fallback to Spanish
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    // Detection options - prioritize Spanish
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;