import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Appearance, useColorScheme} from 'react-native';
import {get, save} from '../utils/storage';

export type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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

  useEffect(() => {
    const initializeTheme = async () => {
      const savedTheme = await get('Theme');
      console.log('saveTheme', savedTheme);
      const systemTheme = Appearance.getColorScheme();
      setTheme(savedTheme || systemTheme);
    };

    initializeTheme();
  }, []);

  const setAndSaveTheme = useCallback(async (newTheme: Theme) => {
    setTheme(newTheme);
    await save('Theme', newTheme);
  }, []);

  const value = useMemo(
    () => ({theme, setTheme: setAndSaveTheme}),
    [theme, setAndSaveTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
