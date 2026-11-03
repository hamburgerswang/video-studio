// ============================================================
//  视频脚本：video-studio 项目介绍
//  - 每个场景选一个"原型组件"填数据；id 必须与同目录 narration.json 的 key 对应
//  - 改完文案后运行 `npm run audio studio-intro`，场景时长按配音自动重算
// ============================================================
import React from "react";
import type { SceneEntry } from "../../framework/types";
import { theme } from "../../framework/theme";
import { TitleScene } from "../../framework/scenes/TitleScene";
import { ListScene } from "../../framework/scenes/ListScene";
import { CodeScene } from "../../framework/scenes/CodeScene";
import { PipelineScene } from "../../framework/scenes/PipelineScene";
import { ExchangeScene } from "../../framework/scenes/ExchangeScene";
import { RecapScene } from "../../framework/scenes/RecapScene";

export const SCENES: SceneEntry[] = [
  // 1. 开场标题
  {
    id: "title",
    node: <TitleScene kicker="项目介绍 · video-studio" title={"用代码做\n分享视频"} />,
  },

  // 2. 框架与内容分离
  {
    id: "structure",
    node: (
      <ListScene
        step={1}
        total={4}
        title="框架与内容分离"
        subtitle="公共能力复用，每支视频互不干扰"
        items={[
          { label: "framework", desc: "场景原型、动画、配音、字幕，所有视频共用" },
          { label: "videos/<主题>", desc: "每支视频一个目录，只放这支视频的内容" },
        ]}
      />
    ),
  },

  // 3. VideoDef
  {
    id: "define",
    node: (
      <CodeScene
        step={2}
        total={4}
        title="一支视频 = 一个 VideoDef"
        subtitle="声明清楚，框架自动注册"
        filename="src/videos/<主题>/video.tsx"
        lines={[
          { text: "export const myVideo: VideoDef = {", color: theme.text },
          { text: '  id: "my-topic",', color: theme.accent },
          { text: '  title: "我的分享",', color: theme.accent },
          { text: "  scenes: SCENES,", color: theme.green },
          { text: "  narration, audioMeta,", color: theme.green },
          { text: "  palette: makePalette({ ... }),", color: theme.yellow },
          { text: "};", color: theme.text },
        ]}
      />
    ),
  },

  // 4. 配音决定时长
  {
    id: "duration",
    node: (
      <PipelineScene
        step={3}
        total={4}
        title="配音决定时长"
        subtitle="时长不用手写"
        stages={[
          { icon: "✍️", name: "写文案", desc: "narration.json" },
          { icon: "🔊", name: "say 配音", desc: "gen_audio.py" },
          { icon: "⏱️", name: "测量时长", desc: "audioMeta.json" },
          { icon: "🎞️", name: "排时间线", desc: "Video.tsx" },
        ]}
        result="改了文案，重跑 npm run audio 即可"
      />
    ),
  },

  // 5. 预览与导出
  {
    id: "render",
    node: (
      <ExchangeScene
        step={4}
        total={4}
        title="预览与导出"
        subtitle="先看效果，再出成片"
        left={{ icon: "🖥️", label: "Studio" }}
        right={{ icon: "🎬", label: "MP4" }}
        messages={[
          { label: "npm run dev 实时预览", dir: "ltr" },
          { label: "npx remotion render 导出", dir: "ltr" },
        ]}
        conclusion="✓ 一条命令出片"
      />
    ),
    sfx: [{ file: "ding.wav", at: 78, volume: 0.55 }],
  },

  // 6. 回顾
  {
    id: "recap",
    node: <RecapScene steps={["新建", "文案", "场景", "配音", "导出"]} title="五步出一支视频" subtitle="复制模板，开始创作" />,
  },
];
