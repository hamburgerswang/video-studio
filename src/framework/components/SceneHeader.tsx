// 场景头部：左上角步骤编号徽标 + 标题 + 副标题，带入场动画
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";

type Props = {
  step: number; // 步骤序号
  total: number; // 总步骤数
  title: string; // 主标题
  subtitle?: string; // 副标题
};

export const SceneHeader: React.FC<Props> = ({ step, total, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // 平滑无回弹入场
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const y = interpolate(enter, [0, 1], [-30, 0]);

  return (
    <div style={{ position: "absolute", top: 70, left: 90, right: 90, opacity: enter, transform: `translateY(${y}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* 步骤徽标 */}
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: 26,
            fontWeight: 700,
            color: "#fff",
            padding: "6px 16px",
            borderRadius: 999,
            background: p.gradient,
          }}
        >
          {String(step).padStart(2, "0")}
          <span style={{ opacity: 0.6, fontSize: 18 }}> / {String(total).padStart(2, "0")}</span>
        </div>
        <div style={{ height: 2, flex: 1, background: theme.border, borderRadius: 2 }} />
      </div>
      <h1 style={{ fontFamily: theme.font, color: theme.text, fontSize: 64, fontWeight: 800, margin: "22px 0 0", letterSpacing: -1 }}>
        {title}
      </h1>
      {subtitle ? (
        <p style={{ fontFamily: theme.font, color: theme.textDim, fontSize: 30, margin: "12px 0 0", fontWeight: 500 }}>{subtitle}</p>
      ) : null}
    </div>
  );
};
