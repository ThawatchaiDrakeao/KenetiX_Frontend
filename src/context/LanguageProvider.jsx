import { useEffect, useMemo, useState, useCallback } from "react";
import { LanguageContext } from "./useLanguage";
import en from "../locales/en.json";
import th from "../locales/th.json";

const LOCALES = { en, th };

function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : null), obj);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = window.localStorage.getItem("kinetix-language");
    return saved === "th" ? "th" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem("kinetix-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key) => {
    const locale = LOCALES[language] || LOCALES.th;
    const fallback = LOCALES.en;
    const val = getNestedValue(locale, key);
    if (val !== null) return val;
    const fb = getNestedValue(fallback, key);
    return fb !== null ? fb : key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    isThai: language === "th",
    setLanguage,
    toggleLanguage: () => setLanguage(l => l === "th" ? "en" : "th"),
    t,
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
