import { LightColors, DarkColors } from "./colors";
import { Typography } from "./typography";

// 🔥 Add this
const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",
  heavy: "System",
};

export const LightTheme = {
  dark: false,
  colors: LightColors,
  typography: Typography,
  fonts: FONTS,       // <-- REQUIRED
};

export const DarkTheme = {
  dark: true,
  colors: DarkColors,
  typography: Typography,
  fonts: FONTS,       // <-- REQUIRED
};
