// 场景 9 · 结尾：完整链路回顾 + 致谢
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme, ACCENT_GRADIENT } from "../../../framework/theme";
import { useReveal } from "../../../framework/components/ui";

// 全流程回顾
const STEPS = ["解析 URL", "DNS 解析", "TCP 握手", "TLS 握手", "HTTP 请求", "服务器处理", "浏览器渲染"];

export const OutroScene: React.FC = () => {
  const titleR = useReveal(70);

  return (
    <AbsoluteFill style={{ fontFamily: theme.font, alignItems: "center", justifyContent: "center" }}>
      {/* 时间线回顾 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 80 }}>
        {STEPS.map((s, i) => {
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
                    background: ACCENT_GRADIENT,
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
                <div style={{ color: theme.textDim, fontSize: 22, marginTop: 12, width: 120 }}>{s}</div>
              </div>
              {i < STEPS.length - 1 ? (
                <div style={{ width: 54, height: 3, background: theme.border, borderRadius: 3, marginBottom: 34, opacity: r }} />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      {/* 标题 */}
      <div style={{ textAlign: "center", opacity: titleR, transform: `translateY(${interpolate(titleR, [0, 1], [30, 0])}px)` }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: -2,
            background: ACCENT_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          一次完整的网络请求之旅
        </div>
        <div style={{ color: theme.textDim, fontSize: 34, marginTop: 20, fontWeight: 500 }}>
          从输入网址到渲染成功，只在毫秒之间 · 感谢观看
        </div>
      </div>
    </AbsoluteFill>
  );
};
