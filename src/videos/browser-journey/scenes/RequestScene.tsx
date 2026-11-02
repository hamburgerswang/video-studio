// 场景 6 · 发送 HTTP 请求：把请求报文发给服务器
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../../../framework/theme";
import { SceneHeader } from "../../../framework/components/SceneHeader";
import { NodeBox, useReveal, useWindowProgress } from "../../../framework/components/ui";

// HTTP 请求报文的行（请求行 + 请求头）
const LINES: { text: string; c: string }[] = [
  { text: "GET /search?q=remotion HTTP/1.1", c: theme.accent },
  { text: "Host: www.example.com", c: theme.text },
  { text: "User-Agent: Mozilla/5.0 ...", c: theme.textDim },
  { text: "Accept: text/html,application/xhtml+xml", c: theme.textDim },
  { text: "Accept-Encoding: gzip, br", c: theme.textDim },
  { text: "Cookie: session=abc123", c: theme.yellow },
];

export const RequestScene: React.FC = () => {
  const travel = useWindowProgress(66, 30);
  const cardR = useReveal(6);

  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={5} total={8} title="发送 HTTP 请求" subtitle="在加密通道里把请求报文发送出去" />

      {/* 请求报文代码卡 */}
      <div
        style={{
          position: "absolute",
          top: 350,
          left: 100,
          width: 820,
          opacity: cardR,
          transform: `translateY(${interpolate(cardR, [0, 1], [24, 0])}px)`,
          background: theme.bgSoft,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ padding: "14px 22px", borderBottom: `1px solid ${theme.border}`, color: theme.textDim, fontFamily: theme.mono, fontSize: 22 }}>
          request headers
        </div>
        <div style={{ padding: "22px 26px", fontFamily: theme.mono, fontSize: 26, lineHeight: 1.7 }}>
          {LINES.map((l, i) => {
            const r = useReveal(14 + i * 7);
            return (
              <div key={l.text} style={{ color: l.c, opacity: r }}>
                {l.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧服务器 */}
      <div style={{ position: "absolute", top: 470, right: 160 }}>
        <NodeBox icon="🖥️" label="服务器" color={theme.green} delay={6} />
      </div>

      {/* 飞向服务器的请求包 */}
      <div
        style={{
          position: "absolute",
          top: 430,
          left: interpolate(travel, [0, 1], [930, 1430]),
          opacity: interpolate(travel, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
          fontFamily: theme.mono,
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          padding: "12px 22px",
          borderRadius: 12,
          background: theme.accent,
          boxShadow: `0 0 40px ${theme.accent}88`,
        }}
      >
        📦 Request →
      </div>
    </AbsoluteFill>
  );
};
