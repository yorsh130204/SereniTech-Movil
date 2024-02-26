//i18next.js
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import es from "../locales/es.json";
import en from "../locales/en.json";

export const languageResources = {
  es: { translation: es },
  en: { translation: en },
};

i18next.use(initReactI18next).init({
    compatibilityJSON: "v3",
    lng: "es",
    fallbackLng: "es",
    resources: languageResources,
});

export default i18next;