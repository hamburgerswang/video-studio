// 原型 · 空白骨架：复制这个文件来做一个全新的自定义场景
//
// 用法要点：
// 1. 顶部用 <SceneHeader> 放步骤编号 + 标题（标题页/回顾页可不用）。
// 2. 任何元素的"依次浮现"用 useReveal(delay) —— delay 是起始帧，越大越晚出现。
// 3. 需要元素从 A 移动到 B（数据包、进度等）用 useWindowProgress(start, dur)。
// 4. 所有动画必须依赖帧，严禁使用 CSS transition / animation。
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { SceneHeader } from "../components/SceneHeader";
import { useReveal } from "../components/ui";

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
};

export const BlankScene: React.FC<Props> = ({ step, total, title, subtitle }) => {
  // 示例：一个在第 16 帧浮现的占位块
  const r = useReveal(16);

  return (
    <AbsoluteFill style={{ fontFamily: theme.font }}>
      <SceneHeader step={step} total={total} title={title} subtitle={subtitle} />

      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            opacity: r,
            transform: `translateY(${interpolate(r, [0, 1], [30, 0])}px)`,
            color: theme.textDim,
            fontSize: 40,
          }}
        >
          在这里写你的场景内容
        </div>
      </div>
    </AbsoluteFill>
  );
};
