import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import mm from './mm.json';

const resources = {
  en: en,
  mm: mm,
};

i18n

  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'mm', // default language to use.
  });

export default {i18n};
