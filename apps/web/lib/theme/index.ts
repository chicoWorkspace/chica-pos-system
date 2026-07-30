import { whiteTheme } from "./white-theme";
import { paletteTheme } from "./palette-theme"; 

export const themeMap = {
  white: whiteTheme,
  palette: paletteTheme,
} as const;

//定義主題的 Key 的型別 (字串 "white" | "palette")
export type ThemeKey = keyof typeof themeMap;

//建立一個主題選單清單，供 UI 下拉選單使用
export const themeList = Object.values(themeMap).map((t) => ({
  key: t.meta.name as ThemeKey,
  direction: t.meta.direction,
}));