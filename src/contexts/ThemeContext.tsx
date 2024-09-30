import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {Appearance} from 'react-native';
import {get, save} from '../utils/storage';
import i18next from 'i18next';

export type Theme = 'light' | 'dark';
export type Languages = 'mm' | 'en';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  languages: Languages;
  setLanguages: (languages: Languages) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [themeLoading, setThemeLoading] = useState(true);
  const [languages, setLanguages] = useState<Languages>('mm');

  useLayoutEffect(() => {
    const initializeTheme = async () => {
      const savedTheme = await get('Theme');
      const saveLanguage = await get('LANGUAGE');

      // const systemTheme = Appearance.getColorScheme();
      // setTheme(savedTheme || systemTheme);
      setTheme(savedTheme || 'light');
      setLanguages(saveLanguage || 'mm');

      setThemeLoading(false);
    };

    initializeTheme();
  }, []);

  const setAndSaveTheme = useCallback(async (newTheme: Theme) => {
    setTheme(newTheme);
    await save('Theme', newTheme);
  }, []);
  const setAndSaveLanguage = useCallback(async (Languages: Languages) => {
    setLanguages(Languages);
    await save('LANGUAGE', Languages);
  }, []);

  useEffect(() => {
    i18next.changeLanguage(languages); // it will change the language through out the app.
  }, [languages]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setAndSaveTheme,
      languages,
      setLanguages: setAndSaveLanguage,
    }),
    [theme, setAndSaveTheme, languages, setAndSaveLanguage],
  );

  return (
    <ThemeContext.Provider value={value}>
      {!themeLoading && children}
    </ThemeContext.Provider>
  );
};
