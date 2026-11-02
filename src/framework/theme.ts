// 框架默认设计令牌：结构色（背景/表面/文本）全仓库共享，强调色可被各主题覆盖
export const theme = {
  // 深色科技风背景（结构色，不随主题变）
  bg: "#070b16",
  bgSoft: "#0e1526",
  surface: "rgba(255, 255, 255, 0.045)",
  surfaceStrong: "rgba(255, 255, 255, 0.08)",
  border: "rgba(255, 255, 255, 0.10)",
  text: "#eaf0ff",
  textDim: "#8a97b5",
  // 强调色（默认值；每个主题可通过 palette 覆盖）
  accent: "#5b8cff",
  accent2: "#9b6bff",
  green: "#38e0a6",
  yellow: "#ffd166",
  red: "#ff6b7a",
  // 字体（不随主题变）
  font: '"PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", system-ui, sans-serif',
  mono: '"SF Mono", "JetBrains Mono", "Fira Code", ui-monospace, monospace',
} as const;

// 可被主题覆盖的调色板
export type Palette = {
  accent: string;
  accent2: string;
  green: string;
  yellow: string;
  red: string;
  gradient: string; // 主渐变
  cycle: string[]; // 列表/流水线等按序循环取色
};

// 由某套强调色派生出完整调色板
export const makePalette = (c: Partial<Palette> = {}): Palette => {
  const accent = c.accent ?? theme.accent;
  const accent2 = c.accent2 ?? theme.accent2;
  const green = c.green ?? theme.green;
  const yellow = c.yellow ?? theme.yellow;
  const red = c.red ?? theme.red;
  return {
    accent,
    accent2,
    green,
    yellow,
    red,
    gradient: c.gradient ?? `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`,
    cycle: c.cycle ?? [accent, green, yellow, accent2, red],
  };
};

// 默认调色板
export const defaultPalette = makePalette();

// 默认主渐变（兼容按固定渐变写的旧场景；主题化场景请用 usePalette().gradient）
export const ACCENT_GRADIENT = defaultPalette.gradient;
