// 原型 · 列表页：一行要点卡片依次浮现，适合"拆解为几个部分 / 需要准备什么"
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette, paletteAt } from "../palette";
import { SceneHeader } from "../components/SceneHeader";
import { useReveal } from "../components/ui";

export type ListItem = {
  label: string; // 标题
  desc?: string; // 说明
  color?: string; // 可选颜色，不填按调色板循环
};

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  items: ListItem[];
};

export const ListScene: React.FC<Props> = ({ step, total, title, subtitle, items }) => {
  const p = usePalette();
  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={step} total={total} title={title} subtitle={subtitle} />

      <div style={{ position: "absolute", top: 380, left: 90, right: 90, display: "flex", gap: 22, justifyContent: "center" }}>
        {items.map((item, i) => {
          const color = item.color ?? paletteAt(p, i);
          const r = useReveal(14 + i * 9);
          return (
            <div
              key={item.label}
              style={{
                flex: 1,
                maxWidth: 420,
                opacity: r,
                transform: `translateY(${interpolate(r, [0, 1], [28, 0])}px)`,
                background: theme.surface,
                border: `1px solid ${color}55`,
                borderTop: `3px solid ${color}`,
                borderRadius: 18,
                padding: "30px 26px",
              }}
            >
              <div style={{ color, fontSize: 34, fontWeight: 800 }}>{item.label}</div>
              {item.desc ? <div style={{ color: theme.textDim, fontSize: 26, marginTop: 14, lineHeight: 1.5 }}>{item.desc}</div> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
