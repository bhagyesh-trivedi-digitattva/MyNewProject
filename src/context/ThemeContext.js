import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createTheme, getFontFamily } from "../theme/theme";
import { applyGlobalFont } from "../theme/GlobalFont";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(null);
  const [appTheme, setAppTheme] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const storedMode = await AsyncStorage.getItem("APP_THEME");
    const themeMode = storedMode || "light";

    const fontFamily = getFontFamily();
    applyGlobalFont(fontFamily);

    setMode(themeMode);
    setAppTheme(createTheme(themeMode));
  };

  const toggleTheme = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    await AsyncStorage.setItem("APP_THEME", newMode);
    setMode(newMode);
    setAppTheme(createTheme(newMode));
  };

  if (!appTheme) return null;

  return (
    <ThemeContext.Provider value={{ appTheme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
