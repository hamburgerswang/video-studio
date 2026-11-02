// 场景 3 · DNS 解析：把域名翻译成服务器 IP 地址
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme, ACCENT_GRADIENT } from "../../../framework/theme";
import { SceneHeader } from "../../../framework/components/SceneHeader";
import { useReveal } from "../../../framework/components/ui";

// DNS 逐级查询的缓存层
const LAYERS = [
  { name: "浏览器缓存", hit: "最近访问过？命中直接返回" },
  { name: "操作系统 / hosts", hit: "本机 hosts 文件与系统缓存" },
  { name: "本地 DNS 服务器", hit: "运营商 DNS，大多在此命中" },
  { name: "根 → 顶级 → 权威", hit: "逐级递归查询拿到结果" },
];

export const DnsScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={2} total={8} title="DNS 解析" subtitle="域名 → IP，网络世界的“电话簿”" />

      <div style={{ position: "absolute", top: 330, left: 90, right: 90, display: "flex", alignItems: "center", gap: 36 }}>
        {/* 域名 */}
        <Box title="域名" value="www.example.com" color={theme.green} delay={6} />

        {/* 查询层级 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          {LAYERS.map((l, i) => {
            const r = useReveal(24 + i * 14);
            return (
              <div
                key={l.name}
                style={{
                  opacity: r,
                  transform: `translateX(${interpolate(r, [0, 1], [-30, 0])}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 14,
                  padding: "16px 22px",
                }}
              >
                <span style={{ fontFamily: theme.mono, color: theme.accent, fontSize: 24, fontWeight: 700 }}>{i + 1}</span>
                <span style={{ color: theme.text, fontSize: 28, fontWeight: 700, width: 280 }}>{l.name}</span>
                <span style={{ color: theme.textDim, fontSize: 24 }}>{l.hit}</span>
              </div>
            );
          })}
        </div>

        {/* 解析结果 IP */}
        <Box title="解析结果 IP" value="93.184.216.34" color={theme.accent} delay={92} glow />
      </div>
    </AbsoluteFill>
  );
};

const Box: React.FC<{ title: string; value: string; color: string; delay: number; glow?: boolean }> = ({
  title,
  value,
  color,
  delay,
  glow,
}) => {
  const r = useReveal(delay);
  return (
    <div
      style={{
        opacity: r,
        transform: `scale(${interpolate(r, [0, 1], [0.85, 1])})`,
        width: 320,
        textAlign: "center",
        background: glow ? ACCENT_GRADIENT : theme.surfaceStrong,
        border: `2px solid ${color}`,
        borderRadius: 20,
        padding: "30px 20px",
        boxShadow: glow ? `0 0 60px ${color}55` : "none",
      }}
    >
      <div style={{ color: glow ? "rgba(255,255,255,0.85)" : theme.textDim, fontSize: 24, fontWeight: 600 }}>{title}</div>
      <div style={{ color: "#fff", fontSize: 34, fontWeight: 800, fontFamily: theme.mono, marginTop: 12 }}>{value}</div>
    </div>
  );
};
