// 全局动态背景：深色渐变 + 缓慢漂移的光晕（跟随主题色）+ 网格纹理
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const p = usePalette();
  // 光晕随帧缓慢平移，营造呼吸感
  const x = interpolate(frame % 300, [0, 150, 300], [-10, 10, -10]);
  const y = interpolate(frame % 360, [0, 180, 360], [-8, 8, -8]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* 顶部主强调色光晕（8 位十六进制末尾两位为透明度）*/}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + x}% ${28 + y}%, ${p.accent}38, transparent 55%)`,
        }}
      />
      {/* 底部次强调色光晕 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 - x}% ${85 - y}%, ${p.accent2}29, transparent 50%)`,
        }}
      />
      {/* 细网格纹理 */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.35,
          maskImage: "radial-gradient(circle at center, black 30%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
};
