// 原型 · 代码页：代码卡逐行浮现，适合"展示配置 / 报文 / 代码片段"
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { SceneHeader } from "../components/SceneHeader";
import { useReveal } from "../components/ui";

export type CodeLine = {
  text: string;
  color?: string; // 不填用默认文本色
};

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  filename?: string; // 代码卡顶部的文件名/标签
  lines: CodeLine[];
};

export const CodeScene: React.FC<Props> = ({ step, total, title, subtitle, filename, lines }) => {
  const cardR = useReveal(6);

  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={step} total={total} title={title} subtitle={subtitle} />

      <div
        style={{
          position: "absolute",
          top: 380,
          left: "50%",
          transform: `translateX(-50%) translateY(${interpolate(cardR, [0, 1], [24, 0])}px)`,
          width: 1200,
          opacity: cardR,
          background: theme.bgSoft,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        {filename ? (
          <div style={{ padding: "14px 24px", borderBottom: `1px solid ${theme.border}`, color: theme.textDim, fontFamily: theme.mono, fontSize: 24 }}>
            {filename}
          </div>
        ) : null}
        <div style={{ padding: "26px 30px", fontFamily: theme.mono, fontSize: 30, lineHeight: 1.7 }}>
          {lines.map((l, i) => {
            const r = useReveal(14 + i * 7);
            return (
              <div key={i} style={{ color: l.color ?? theme.text, opacity: r }}>
                {l.text || " "}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
