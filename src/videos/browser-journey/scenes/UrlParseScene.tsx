// 场景 2 · 解析 URL：浏览器把网址拆解为协议 / 域名 / 端口 / 路径 / 参数
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../../../framework/theme";
import { SceneHeader } from "../../../framework/components/SceneHeader";
import { useReveal } from "../../../framework/components/ui";
import { interpolate } from "remotion";

// URL 各组成部分
const PARTS = [
  { text: "https://", label: "协议", desc: "决定用 HTTP 还是 HTTPS 传输", color: theme.accent },
  { text: "www.example.com", label: "域名", desc: "需要解析成服务器 IP", color: theme.green },
  { text: ":443", label: "端口", desc: "HTTPS 默认 443，可省略", color: theme.yellow },
  { text: "/search", label: "路径", desc: "定位服务器上的资源", color: theme.accent2 },
  { text: "?q=remotion", label: "查询参数", desc: "携带附加的请求数据", color: theme.red },
];

export const UrlParseScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={1} total={8} title="解析 URL" subtitle="浏览器先看懂你输入的网址" />

      {/* 完整 URL，分段高亮 */}
      <div style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", fontFamily: theme.mono, fontSize: 58, fontWeight: 700 }}>
        {PARTS.map((p, i) => {
          const r = useReveal(10 + i * 6);
          return (
            <span key={p.text} style={{ color: p.color, opacity: interpolate(r, [0, 1], [0.25, 1]) }}>
              {p.text}
            </span>
          );
        })}
      </div>

      {/* 分段说明卡片 */}
      <div style={{ position: "absolute", top: 460, left: 90, right: 90, display: "flex", gap: 20, justifyContent: "center" }}>
        {PARTS.map((p, i) => {
          const r = useReveal(40 + i * 8);
          return (
            <div
              key={p.label}
              style={{
                flex: 1,
                opacity: r,
                transform: `translateY(${interpolate(r, [0, 1], [26, 0])}px)`,
                background: theme.surface,
                border: `1px solid ${p.color}55`,
                borderTop: `3px solid ${p.color}`,
                borderRadius: 16,
                padding: "24px 20px",
              }}
            >
              <div style={{ color: p.color, fontSize: 30, fontWeight: 800 }}>{p.label}</div>
              <div style={{ color: theme.textDim, fontSize: 24, marginTop: 12, lineHeight: 1.4 }}>{p.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
