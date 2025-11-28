import { Text, TextInput } from "react-native";

const mergeFont = (style, fontFamily) => {
  if (!style) return { fontFamily };
  if (Array.isArray(style)) return [{ fontFamily }, ...style];
  if (typeof style === "object") return { fontFamily, ...style };
  return style;
};

export const applyGlobalFont = (fontFamily) => {
  if (!fontFamily) return;

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = mergeFont(Text.defaultProps.style, fontFamily);

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = mergeFont(TextInput.defaultProps.style, fontFamily);
};
