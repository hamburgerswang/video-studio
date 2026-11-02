// 调色板上下文：让每个主题（video）注入自己的强调色
import React, { createContext, useContext } from "react";
import { Palette, defaultPalette } from "./theme";

const PaletteContext = createContext<Palette>(defaultPalette);

export const PaletteProvider: React.FC<{ palette?: Palette; children: React.ReactNode }> = ({ palette, children }) => (
  <PaletteContext.Provider value={palette ?? defaultPalette}>{children}</PaletteContext.Provider>
);

// 在场景/组件里取当前主题调色板
export const usePalette = () => useContext(PaletteContext);

// 按索引循环取色
export const paletteAt = (p: Palette, i: number) => p.cycle[i % p.cycle.length];
