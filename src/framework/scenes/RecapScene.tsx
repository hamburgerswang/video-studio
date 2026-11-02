// 原型 · 回顾页：时间线串起所有步骤 + 收尾标题，适合结尾
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { useReveal } from "../components/ui";

type Props = {
  steps: string[]; // 回顾的步骤名
  title: string; // 收尾大标题
  subtitle?: string;
};

export const RecapScene: React.FC<Props> = ({ steps, title, subtitle }) => {
  const p = usePalette();
  const titleR = useReveal(8 + steps.length * 9 + 10);

  return (
    <AbsoluteFill style={{ fontFamily: theme.font, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 80, flexWrap: "wrap", justifyContent: "center" }}>
        {steps.map((s, i) => {
          const r = useReveal(8 + i * 9);
          return (
            <React.Fragment key={s}>
              <div style={{ textAlign: "center", opacity: r, transform: `scale(${interpolate(r, [0, 1], [0.7, 1])})` }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    margin: "0 auto",
                    borderRadius: 999,
                    background: p.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: theme.mono,
                    fontWeight: 800,
                    fontSize: 28,
                    color: "#fff",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ color: theme.textDim, fontSize: 22, marginTop: 12, width: 130 }}>{s}</div>
              </div>
              {i < steps.length - 1 ? (
                <div style={{ width: 48, height: 3, background: theme.border, borderRadius: 3, marginBottom: 34, opacity: r }} />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ textAlign: "center", opacity: titleR, transform: `translateY(${interpolate(titleR, [0, 1], [30, 0])}px)` }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: -2,
            background: p.gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </div>
        {subtitle ? <div style={{ color: theme.textDim, fontSize: 34, marginTop: 20, fontWeight: 500 }}>{subtitle}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
