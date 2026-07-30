import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import commonEn from "./locales/en/common.json";
import homeEn from "./locales/en/home.json";
import commonEs from "./locales/es/common.json";
import homeEs from "./locales/es/home.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: commonEn, home: homeEn },
            es: { common: commonEs, home: homeEs }
        },
        fallbackLng: "en",
        defaultNS: "common",
        ns: ["common", "home"],
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ["querystring", "localStorage", "navigator"],
            caches: ["localStorage"]
        }
    });

export default i18n;
