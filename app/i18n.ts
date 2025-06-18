import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const supportedLngs = {
  en: 'English',
  ko: '한국어', // Korean
  es: 'Español', // Spanish
  fr: 'Français', // French
};

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: Object.keys(supportedLngs),
    debug: process.env.NODE_ENV === 'development', // Enable debug output in development
    ns: ['translation'], // Default namespace
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng', // Key for localStorage
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
     react: {
      useSuspense: true, // Crucial for using Suspense for loading translations
    }
  });

export default i18next;