// 场景 7 · 服务器处理并响应：业务处理后返回 200 OK
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../framework/theme";
import { SceneHeader } from "../../../framework/components/SceneHeader";
import { useReveal } from "../../../framework/components/ui";

// 服务器内部处理链路
const STAGES = [
  { icon: "⚖️", name: "负载均衡", d: "分发到空闲节点" },
  { icon: "⚙️", name: "应用服务", d: "执行业务逻辑" },
  { icon: "🗄️", name: "数据库 / 缓存", d: "查询所需数据" },
  { icon: "📄", name: "组装响应", d: "生成 HTML / JSON" },
];

export const ServerScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={6} total={8} title="服务器处理并响应" subtitle="后端完成计算与取数，返回结果" />

      {/* 内部处理链路 */}
      <div style={{ position: "absolute", top: 360, left: 90, right: 90, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        {STAGES.map((s, i) => {
          const r = useReveal(10 + i * 16);
          return (
            <React.Fragment key={s.name}>
              <div
                style={{
                  width: 240,
                  opacity: r,
                  transform: `translateY(${interpolate(r, [0, 1], [24, 0])}px)`,
                  textAlign: "center",
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 18,
                  padding: "26px 16px",
                }}
              >
                <div style={{ fontSize: 60 }}>{s.icon}</div>
                <div style={{ color: theme.text, fontSize: 28, fontWeight: 700, marginTop: 10 }}>{s.name}</div>
                <div style={{ color: theme.textDim, fontSize: 22, marginTop: 8 }}>{s.d}</div>
              </div>
              {i < STAGES.length - 1 ? <Arrow delay={18 + i * 16} /> : null}
            </React.Fragment>
          );
        })}
      </div>

      {/* 响应状态行 */}
      <ResponseCard />
    </AbsoluteFill>
  );
};

const Arrow: React.FC<{ delay: number }> = ({ delay }) => {
  const r = useReveal(delay);
  return <div style={{ color: theme.accent, fontSize: 40, opacity: r }}>→</div>;
};

const ResponseCard: React.FC = () => {
  const r = useReveal(78);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 215,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: r,
        transform: `translateY(${interpolate(r, [0, 1], [24, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: theme.mono,
          fontSize: 34,
          fontWeight: 700,
          color: theme.text,
          background: theme.surfaceStrong,
          border: `1px solid ${theme.green}`,
          borderRadius: 14,
          padding: "20px 36px",
          boxShadow: `0 0 50px ${theme.green}33`,
        }}
      >
        <span style={{ color: theme.green, fontWeight: 800 }}>HTTP/1.1 200 OK</span>
        <span style={{ color: theme.textDim }}>　Content-Type: text/html　←　返回给浏览器</span>
      </div>
    </div>
  );
};
