import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations, type Lang } from "@/lib/content";

type LocaleValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof translations)[Lang];
};

const LocaleContext = createContext<LocaleValue>({
  lang: "it",
  setLang: () => {},
  t: translations.en,
});

const STORAGE_KEY = "basilisk-lang";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "it" || saved === "en") {
      setLangState(saved);
      return;
    }
    // Base language is Italian; only a clearly non-Italian browser flips the default to English.
    if (!navigator.language.toLowerCase().startsWith("it")) setLangState("en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, t: translations[lang] }),
    [lang, setLang],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  return useContext(LocaleContext);
}
