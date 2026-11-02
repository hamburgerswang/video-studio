// 原型 · 交互页：两个端点之间数据包来回飞，适合"握手 / 请求响应 / 通信"
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette, paletteAt } from "../palette";
import { SceneHeader } from "../components/SceneHeader";
import { NodeBox, useReveal, useWindowProgress } from "../components/ui";

export type Message = {
  label: string;
  dir: "ltr" | "rtl"; // ltr = 左→右，rtl = 右→左
  color?: string;
};

type Endpoint = { icon: string; label: string };

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  left: Endpoint;
  right: Endpoint;
  messages: Message[];
  conclusion?: string;
};

const LEFT_X = 360;
const RIGHT_X = 1360;
const LANE_TOP = 470;
const MSG_START = 20; // 第一条消息的起始帧
const MSG_GAP = 34; // 相邻消息的间隔帧
const MSG_DUR = 24; // 单条消息飞行帧数

export const ExchangeScene: React.FC<Props> = ({ step, total, title, subtitle, left, right, messages, conclusion }) => {
  const p = usePalette();
  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={step} total={total} title={title} subtitle={subtitle} />

      <div style={{ position: "absolute", top: 520, left: 150 }}>
        <NodeBox icon={left.icon} label={left.label} color={p.accent} delay={6} />
      </div>
      <div style={{ position: "absolute", top: 520, right: 150 }}>
        <NodeBox icon={right.icon} label={right.label} color={p.green} delay={6} />
      </div>

      {messages.map((m, i) => {
        const start = MSG_START + i * MSG_GAP;
        const progress = useWindowProgress(start, MSG_DUR);
        const reveal = useReveal(start - 4);
        const color = m.color ?? paletteAt(p, i);
        const x = m.dir === "ltr" ? interpolate(progress, [0, 1], [LEFT_X, RIGHT_X]) : interpolate(progress, [0, 1], [RIGHT_X, LEFT_X]);
        const arrived = progress >= 1;
        return (
          <div
            key={m.label}
            style={{
              position: "absolute",
              top: LANE_TOP + i * 56,
              left: x,
              opacity: reveal,
              fontFamily: theme.mono,
              fontSize: 26,
              fontWeight: 700,
              color: arrived ? "#fff" : color,
              padding: "10px 20px",
              borderRadius: 10,
              background: arrived ? color : `${color}22`,
              border: `1px solid ${color}`,
              whiteSpace: "nowrap",
            }}
          >
            {m.dir === "ltr" ? "→ " : "← "}
            {m.label}
          </div>
        );
      })}

      {conclusion ? <Conclusion text={conclusion} delay={MSG_START + messages.length * MSG_GAP} /> : null}
    </AbsoluteFill>
  );
};

const Conclusion: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
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
        color: p.green,
        fontSize: 34,
        fontWeight: 800,
      }}
    >
      {text}
    </div>
  );
};
