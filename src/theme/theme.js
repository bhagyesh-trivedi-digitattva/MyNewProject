import { LightColors, DarkColors } from "./colors";

export const getFontFamily = () => "BBHSansHegarty-Regular";

export const createTheme = (mode) => {
  return {
    dark: mode === "dark",
    colors: mode === "dark" ? DarkColors : LightColors,

    // 👇 REQUIRED by React Navigation
    fonts: {
      regular: { fontFamily: "BBHSansHegarty-Regular", fontWeight: "400" },
      medium: { fontFamily: "BBHSansHegarty-Regular", fontWeight: "500" },
      bold: { fontFamily: "BBHSansHegarty-Regular", fontWeight: "700" },
      heavy: { fontFamily: "BBHSansHegarty-Regular", fontWeight: "800" },
    },
  };
};
