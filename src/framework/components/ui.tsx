// 通用 UI 构件：延迟入场工具、卡片、节点盒、标签芯片
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

// 延迟入场进度（0→1），用于让元素依次出现
export const useReveal = (delayFrames: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delayFrames, fps, config: { damping: 200 } });
};

// 线性窗口进度（0→1），用于数据包在 [start, start+duration] 帧区间内移动
export const useWindowProgress = (start: number, duration: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// 带入场动画的卡片容器
export const Card: React.FC<{ delay?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  delay = 0,
  style,
  children,
}) => {
  const p = useReveal(delay);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 28,
        backdropFilter: "blur(6px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// 端点节点（如“客户端 / 浏览器”“服务器”）
export const NodeBox: React.FC<{ icon: string; label: string; color?: string; delay?: number }> = ({
  icon,
  label,
  color = theme.accent,
  delay = 0,
}) => {
  const p = useReveal(delay);
  return (
    <div style={{ opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`, textAlign: "center" }}>
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 76,
          background: theme.surfaceStrong,
          border: `2px solid ${color}`,
          boxShadow: `0 0 50px ${color}44`,
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: theme.font, color: theme.text, fontSize: 28, fontWeight: 700, marginTop: 16 }}>{label}</div>
    </div>
  );
};

// 小标签芯片
export const Chip: React.FC<{ text: string; color: string; delay?: number }> = ({ text, color, delay = 0 }) => {
  const p = useReveal(delay);
  return (
    <span
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
        display: "inline-block",
        fontFamily: theme.mono,
        fontSize: 24,
        fontWeight: 600,
        color,
        padding: "8px 18px",
        borderRadius: 10,
        background: `${color}1a`,
        border: `1px solid ${color}55`,
      }}
    >
      {text}
    </span>
  );
};
