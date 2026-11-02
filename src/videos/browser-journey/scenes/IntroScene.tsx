// 场景 1 · 开场：模拟浏览器地址栏输入网址并回车
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme, ACCENT_GRADIENT } from "../../../framework/theme";

const URL = "https://www.example.com";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 打字机：每 3 帧出现一个字符
  const typed = URL.slice(0, Math.floor(frame / 3));
  const typingDone = typed.length === URL.length;
  // 光标闪烁
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  // 浏览器窗口入场
  const winIn = spring({ frame, fps, config: { damping: 200 } });
  // 标题在打字完成后淡入
  const titleIn = spring({ frame: frame - 48, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: theme.font }}>
      {/* 模拟浏览器窗口 */}
      <div
        style={{
          width: 1180,
          opacity: winIn,
          transform: `translateY(${interpolate(winIn, [0, 1], [40, 0])}px) scale(${interpolate(winIn, [0, 1], [0.95, 1])})`,
          background: theme.bgSoft,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
        }}
      >
        {/* 窗口顶部栏 */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 28px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Dot c="#ff5f57" />
            <Dot c="#febc2e" />
            <Dot c="#28c840" />
          </div>
          {/* 地址栏 */}
          <div
            style={{
              flex: 1,
              marginLeft: 10,
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: theme.surface,
              border: `1px solid ${typingDone ? theme.accent : theme.border}`,
              borderRadius: 12,
              padding: "14px 22px",
              fontFamily: theme.mono,
              fontSize: 30,
              color: theme.text,
            }}
          >
            <span style={{ color: theme.textDim }}>🔒</span>
            <span>
              {typed}
              {!typingDone && cursorOn ? <span style={{ color: theme.accent }}>|</span> : null}
            </span>
          </div>
          {/* 回车键提示 */}
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 24,
              color: typingDone ? "#fff" : theme.textDim,
              padding: "12px 20px",
              borderRadius: 10,
              background: typingDone ? ACCENT_GRADIENT : theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            ⏎ Enter
          </div>
        </div>
        {/* 窗口内容区占位 */}
        <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textDim, fontSize: 28 }}>
          {typingDone ? "正在加载…" : " "}
        </div>
      </div>

      {/* 标题 */}
      <div style={{ marginTop: 70, textAlign: "center", opacity: titleIn, transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0])}px)` }}>
        <div style={{ fontSize: 34, color: theme.textDim, fontWeight: 600 }}>按下回车之后……</div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: -2,
            marginTop: 10,
            background: ACCENT_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          究竟发生了什么？
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Dot: React.FC<{ c: string }> = ({ c }) => (
  <div style={{ width: 16, height: 16, borderRadius: 999, background: c }} />
);
