// 场景 5 · TLS 握手：为 HTTPS 建立加密通道
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme, ACCENT_GRADIENT } from "../../../framework/theme";
import { SceneHeader } from "../../../framework/components/SceneHeader";
import { useReveal } from "../../../framework/components/ui";

const STEPS = [
  { t: "Client Hello", d: "发送支持的加密套件与随机数" },
  { t: "Server Hello + 证书", d: "选定套件，下发含公钥的数字证书" },
  { t: "校验证书 · 交换密钥", d: "验证证书合法后协商出会话密钥" },
  { t: "加密通道建立", d: "之后所有数据都被对称加密传输" },
];

export const TlsScene: React.FC = () => {
  const frame = useCurrentFrame();
  // 最后一步完成后，锁“合上”
  const locked = frame > 92;

  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={4} total={8} title="TLS 握手" subtitle="HTTPS 的加密握手，保证数据不被窃听篡改" />

      <div style={{ position: "absolute", top: 340, left: 90, right: 90, display: "flex", gap: 50, alignItems: "center" }}>
        {/* 左侧步骤 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {STEPS.map((s, i) => {
            const r = useReveal(12 + i * 18);
            return (
              <div
                key={s.t}
                style={{
                  opacity: r,
                  transform: `translateX(${interpolate(r, [0, 1], [-30, 0])}px)`,
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderLeft: `4px solid ${theme.accent}`,
                  borderRadius: 14,
                  padding: "18px 24px",
                }}
              >
                <span style={{ fontFamily: theme.mono, color: theme.accent2, fontSize: 28, fontWeight: 800 }}>{i + 1}</span>
                <div>
                  <div style={{ color: theme.text, fontSize: 30, fontWeight: 700 }}>{s.t}</div>
                  <div style={{ color: theme.textDim, fontSize: 24, marginTop: 6 }}>{s.d}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 右侧大锁：握手完成后点亮并合上 */}
        <div style={{ width: 420, textAlign: "center" }}>
          <div
            style={{
              fontSize: 220,
              lineHeight: 1,
              filter: locked ? "none" : "grayscale(1)",
              opacity: locked ? 1 : 0.4,
              transform: `scale(${locked ? 1 : 0.9})`,
            }}
          >
            {locked ? "🔒" : "🔓"}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 34,
              fontWeight: 800,
              background: locked ? ACCENT_GRADIENT : "none",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: locked ? "transparent" : theme.textDim,
            }}
          >
            {locked ? "加密通道已建立" : "协商中…"}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
