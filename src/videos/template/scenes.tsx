// ============================================================
//  视频脚本（主要编辑）：把这支分享声明为一串场景
//  - 每个场景选一个"原型组件"填数据；id 必须与同目录 narration.json 的 key 对应
//  - 改完文案后运行 `npm run audio _template`，场景时长按配音自动重算
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
  {
    id: "title",
    node: <TitleScene kicker="模板示例 · 可直接替换" title={"用这个模板\n做你的分享视频"} />,
  },
  {
    id: "prepare",
    node: (
      <ListScene
        step={1}
        total={4}
        title="准备三样东西"
        subtitle="开始前先想清楚内容与风格"
        items={[
          { label: "文案与字幕", desc: "写进 narration.json，一处搞定配音和字幕" },
          { label: "配色主题", desc: "在 video.tsx 里传 palette 即可整体换肤" },
          { label: "场景原型", desc: "列表 / 流水线 / 交互 / 代码 / 回顾，任意拼" },
        ]}
      />
    ),
  },
  {
    id: "config",
    node: (
      <CodeScene
        step={2}
        total={4}
        title="像填表一样写视频"
        subtitle="选一个原型，填入数据"
        filename="src/videos/<主题>/scenes.tsx"
        lines={[
          { text: "{", color: theme.textDim },
          { text: '  id: "prepare",', color: theme.accent },
          { text: "  node: <ListScene", color: theme.text },
          { text: '    title="准备三样东西"', color: theme.green },
          { text: "    items={[ ... ]} />", color: theme.yellow },
          { text: "}", color: theme.textDim },
        ]}
      />
    ),
  },
  {
    id: "flow",
    node: (
      <PipelineScene
        step={3}
        total={4}
        title="四步出片"
        subtitle="从文案到成片的流程"
        stages={[
          { icon: "✍️", name: "写文案", desc: "narration.json" },
          { icon: "🧩", name: "配场景", desc: "scenes.tsx" },
          { icon: "🔊", name: "生成配音", desc: "npm run audio" },
          { icon: "🎬", name: "渲染导出", desc: "npm run render" },
        ]}
        result="改文案 → 场景时长自动跟着变，音画始终同步"
      />
    ),
  },
  {
    id: "exchange",
    node: (
      <ExchangeScene
        step={4}
        total={4}
        title="交互原型示例"
        subtitle="两个端点之间的数据往来"
        left={{ icon: "💻", label: "客户端" }}
        right={{ icon: "🖥️", label: "服务器" }}
        messages={[
          { label: "请求 Request", dir: "ltr" },
          { label: "响应 Response", dir: "rtl" },
        ]}
        conclusion="✓ 通信过程一目了然"
      />
    ),
    sfx: [{ file: "ding.wav", at: 78, volume: 0.55 }],
  },
  {
    id: "recap",
    node: <RecapScene steps={["文案", "配色", "场景", "配音", "渲染"]} title="开始创作吧" subtitle="复制本模板，替换内容即可" />,
  },
];
