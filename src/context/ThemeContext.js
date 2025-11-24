import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightTheme, DarkTheme } from '../theme/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [appTheme, setAppTheme] = useState(LightTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem('APP_THEME');
      if (stored === 'dark') setAppTheme(DarkTheme);
      else setAppTheme(LightTheme);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleTheme = async () => {
    const newTheme = appTheme.dark ? LightTheme : DarkTheme;
    setAppTheme(newTheme);
    await AsyncStorage.setItem('APP_THEME', newTheme.dark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ appTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
