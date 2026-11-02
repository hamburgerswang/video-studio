// 字幕组件：把一组字幕按文字长度加权分配到时间轴上，逐条显示
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

type Props = {
  segments: string[]; // 字幕分句
  from: number; // 字幕区间起始帧（本地）
  durationFrames: number; // 字幕区间总帧数
};

export const Captions: React.FC<Props> = ({ segments, from, durationFrames }) => {
  const frame = useCurrentFrame();

  // 按每句字数加权，计算每句的起止帧
  const weights = segments.map((s) => s.length);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let acc = from;
  const windows = segments.map((text, i) => {
    const span = (weights[i] / totalWeight) * durationFrames;
    const start = acc;
    acc += span;
    return { text, start, end: acc };
  });

  // 找到当前帧对应的字幕
  const current = windows.find((w) => frame >= w.start && frame < w.end) ?? null;
  if (!current) return null;

  // 进入/退出淡变
  const FADE = 8;
  const opacity = interpolate(
    frame,
    [current.start, current.start + FADE, current.end - FADE, current.end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div style={{ position: "absolute", bottom: 72, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          opacity,
          maxWidth: 1400,
          textAlign: "center",
          fontFamily: theme.font,
          fontSize: 40,
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.4,
          padding: "16px 36px",
          borderRadius: 16,
          background: "rgba(5, 8, 16, 0.72)",
          border: `1px solid ${theme.border}`,
          backdropFilter: "blur(8px)",
          textShadow: "0 2px 10px rgba(0,0,0,0.6)",
        }}
      >
        {current.text}
      </div>
    </div>
  );
};
