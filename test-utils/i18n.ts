import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from '../src/i18n/locale';

const kafkai18n = i18n.createInstance();

kafkai18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: {
      order: ['htmlTag', 'navigator'],
      caches: [],
    },
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false,
    },
    resources,
  });

export default kafkai18n;
