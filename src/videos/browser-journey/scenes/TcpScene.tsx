// 场景 4 · TCP 三次握手：建立可靠连接
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../framework/theme";
import { SceneHeader } from "../../../framework/components/SceneHeader";
import { NodeBox, useReveal, useWindowProgress } from "../../../framework/components/ui";

// 三次握手的报文定义：dir=1 为 客户端→服务器，dir=-1 为 服务器→客户端
const PACKETS = [
  { label: "SYN  seq=x", dir: 1, start: 20, dur: 24, color: theme.accent, lane: 0 },
  { label: "SYN + ACK", dir: -1, start: 50, dur: 24, color: theme.green, lane: 1 },
  { label: "ACK  连接建立 ✓", dir: 1, start: 80, dur: 24, color: theme.yellow, lane: 2 },
];

const LEFT_X = 360; // 左侧（客户端）轨道起点
const RIGHT_X = 1360; // 右侧（服务器）轨道终点
const LANE_TOP = 470; // 第一条轨道的纵向位置

export const TcpScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={3} total={8} title="TCP 三次握手" subtitle="在通信前先建立一条可靠连接" />

      {/* 两端节点 */}
      <div style={{ position: "absolute", top: 520, left: 150 }}>
        <NodeBox icon="💻" label="客户端 / 浏览器" color={theme.accent} delay={6} />
      </div>
      <div style={{ position: "absolute", top: 520, right: 150 }}>
        <NodeBox icon="🖥️" label="服务器" color={theme.green} delay={6} />
      </div>

      {/* 握手报文 */}
      {PACKETS.map((p) => {
        const progress = useWindowProgress(p.start, p.dur);
        const reveal = useReveal(p.start - 4);
        // 根据方向计算水平位置
        const x = p.dir === 1 ? interpolate(progress, [0, 1], [LEFT_X, RIGHT_X]) : interpolate(progress, [0, 1], [RIGHT_X, LEFT_X]);
        const arrived = progress >= 1;
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              top: LANE_TOP + p.lane * 56,
              left: x,
              opacity: reveal,
              fontFamily: theme.mono,
              fontSize: 26,
              fontWeight: 700,
              color: arrived ? "#fff" : p.color,
              padding: "10px 20px",
              borderRadius: 10,
              background: arrived ? `${p.color}` : `${p.color}22`,
              border: `1px solid ${p.color}`,
              whiteSpace: "nowrap",
            }}
          >
            {p.dir === 1 ? "→ " : "← "}
            {p.label}
          </div>
        );
      })}

      {/* 底部结论 */}
      <Conclusion />
    </AbsoluteFill>
  );
};

const Conclusion: React.FC = () => {
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
        transform: `translateY(${interpolate(r, [0, 1], [20, 0])}px)`,
        color: theme.green,
        fontSize: 34,
        fontWeight: 800,
      }}
    >
      ✓ 三次握手完成，双方确认收发能力正常，连接已就绪
    </div>
  );
};
