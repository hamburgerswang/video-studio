// 原型 · 标题页：居中大标题，适合开场
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";

type Props = {
  kicker?: string; // 标题上方的小字
  title: string; // 主标题，用 \n 换行
};

export const TitleScene: React.FC<Props> = ({ kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const kickerIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: theme.font }}>
      {kicker ? (
        <div style={{ opacity: kickerIn, color: theme.textDim, fontSize: 34, fontWeight: 600, marginBottom: 18 }}>{kicker}</div>
      ) : null}
      <div
        style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
          textAlign: "center",
          fontSize: 100,
          fontWeight: 900,
          letterSpacing: -2,
          lineHeight: 1.15,
          background: p.gradient,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {title.split("\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
