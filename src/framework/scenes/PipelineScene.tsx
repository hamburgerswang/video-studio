// 原型 · 流水线页：箭头串起多个阶段，适合"流程 / 步骤链路"
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { SceneHeader } from "../components/SceneHeader";
import { useReveal } from "../components/ui";

export type Stage = {
  icon?: string; // emoji 图标
  name: string;
  desc?: string;
};

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  stages: Stage[];
  result?: string; // 可选的底部结论横幅
};

export const PipelineScene: React.FC<Props> = ({ step, total, title, subtitle, stages, result }) => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={step} total={total} title={title} subtitle={subtitle} />

      <div style={{ position: "absolute", top: 400, left: 90, right: 90, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {stages.map((s, i) => {
          const r = useReveal(12 + i * 15);
          return (
            <React.Fragment key={s.name}>
              <div
                style={{
                  flex: 1,
                  opacity: r,
                  transform: `translateY(${interpolate(r, [0, 1], [26, 0])}px)`,
                  textAlign: "center",
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 18,
                  padding: "28px 16px",
                }}
              >
                {s.icon ? <div style={{ fontSize: 60 }}>{s.icon}</div> : null}
                <div style={{ color: theme.text, fontSize: 30, fontWeight: 700, marginTop: s.icon ? 10 : 0 }}>{s.name}</div>
                {s.desc ? <div style={{ color: theme.textDim, fontSize: 23, marginTop: 8 }}>{s.desc}</div> : null}
              </div>
              {i < stages.length - 1 ? <Arrow delay={20 + i * 15} /> : null}
            </React.Fragment>
          );
        })}
      </div>

      {result ? <Result text={result} delay={14 + stages.length * 15} /> : null}
    </AbsoluteFill>
  );
};

const Arrow: React.FC<{ delay: number }> = ({ delay }) => {
  const r = useReveal(delay);
  const p = usePalette();
  return <div style={{ color: p.accent, fontSize: 40, opacity: r }}>→</div>;
};

const Result: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const r = useReveal(delay);
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 215,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: r,
        transform: `translateY(${interpolate(r, [0, 1], [20, 0])}px)`,
        fontSize: 38,
        fontWeight: 800,
        background: p.gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {text}
    </div>
  );
};
