// 场景 8 · 浏览器渲染：关键渲染路径（Critical Rendering Path）
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme, ACCENT_GRADIENT } from "../../../framework/theme";
import { SceneHeader } from "../../../framework/components/SceneHeader";
import { useReveal } from "../../../framework/components/ui";

// 渲染流水线后半段：合并后的串行阶段
const PIPELINE = [
  { name: "渲染树", d: "DOM + CSSOM 合并", color: theme.accent2 },
  { name: "布局 Layout", d: "计算位置与尺寸", color: theme.yellow },
  { name: "绘制 Paint", d: "填充像素", color: theme.red },
  { name: "合成 Composite", d: "分层合成上屏", color: theme.green },
];

export const RenderScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={7} total={8} title="浏览器渲染页面" subtitle="解析 → 构建 → 布局 → 绘制 → 合成" />

      {/* 上：HTML→DOM 与 CSS→CSSOM 两条解析线 */}
      <div style={{ position: "absolute", top: 320, left: 100, display: "flex", flexDirection: "column", gap: 20 }}>
        <ParseRow src="HTML" dst="DOM 树" color={theme.accent} delay={8} />
        <ParseRow src="CSS" dst="CSSOM 树" color={theme.green} delay={22} />
      </div>

      {/* 合并箭头 */}
      <div style={{ position: "absolute", top: 360, left: 640, color: theme.textDim, fontSize: 52, opacity: useReveal(36) }}>⟶</div>

      {/* 下：串行渲染流水线 */}
      <div style={{ position: "absolute", top: 520, left: 100, right: 100, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {PIPELINE.map((p, i) => {
          const r = useReveal(44 + i * 16);
          return (
            <React.Fragment key={p.name}>
              <div
                style={{
                  flex: 1,
                  opacity: r,
                  transform: `translateY(${interpolate(r, [0, 1], [24, 0])}px)`,
                  textAlign: "center",
                  background: theme.surface,
                  border: `1px solid ${p.color}66`,
                  borderBottom: `3px solid ${p.color}`,
                  borderRadius: 16,
                  padding: "24px 12px",
                }}
              >
                <div style={{ color: p.color, fontSize: 30, fontWeight: 800 }}>{p.name}</div>
                <div style={{ color: theme.textDim, fontSize: 22, marginTop: 10 }}>{p.d}</div>
              </div>
              {i < PIPELINE.length - 1 ? <span style={{ color: theme.textDim, fontSize: 34, opacity: r }}>→</span> : null}
            </React.Fragment>
          );
        })}
      </div>

      {/* 结果：页面显示 */}
      <Result />
    </AbsoluteFill>
  );
};

const ParseRow: React.FC<{ src: string; dst: string; color: string; delay: number }> = ({ src, dst, color, delay }) => {
  const r = useReveal(delay);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: r, transform: `translateX(${interpolate(r, [0, 1], [-24, 0])}px)` }}>
      <Pill text={src} color={color} filled />
      <span style={{ color: theme.textDim, fontSize: 30 }}>解析 →</span>
      <Pill text={dst} color={color} />
    </div>
  );
};

const Pill: React.FC<{ text: string; color: string; filled?: boolean }> = ({ text, color, filled }) => (
  <div
    style={{
      fontFamily: theme.mono,
      fontSize: 28,
      fontWeight: 700,
      color: filled ? "#fff" : color,
      background: filled ? color : `${color}1f`,
      border: `1px solid ${color}`,
      borderRadius: 12,
      padding: "12px 24px",
      minWidth: 150,
      textAlign: "center",
    }}
  >
    {text}
  </div>
);

const Result: React.FC = () => {
  const r = useReveal(108);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 215,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: r,
        transform: `scale(${interpolate(r, [0, 1], [0.9, 1])})`,
        fontSize: 42,
        fontWeight: 900,
        background: ACCENT_GRADIENT,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      🎉 页面渲染完成，用户看到了完整内容
    </div>
  );
};
