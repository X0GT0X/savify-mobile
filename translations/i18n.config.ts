import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import 'intl-pluralrules';
import { initReactI18next } from 'react-i18next';
import { en, uk } from './index';

const resources = {
  en: {
    translation: en,
  },
  uk: {
    translation: uk,
  },
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: getLocales()[0].languageCode ?? 'en',
  fallbackLng: 'en',
  debug: false,
  nonExplicitSupportedLngs: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
