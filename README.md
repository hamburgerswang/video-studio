# video-studio · 分享视频工作台

一个仓库维护**多支**分享视频：公共能力沉淀为框架，每支视频（每次分享）是 `src/videos/` 下的一个独立主题目录，资产互不干扰、框架充分复用。全部内置中文配音、音效、字幕。

## 核心理念

- **框架与内容分离**：`src/framework/` 是所有视频共享的引擎（场景原型、动画、配音/音效/字幕、渲染）；`src/videos/<主题>/` 只放这支视频的内容。
- **一支视频 = 一个 `VideoDef`**：声明 id、标题、场景数组、配音、（可选）配色，框架据此自动生成 Composition。
- **内容即数据**：做新视频主要就是写 `narration.json`（文案+字幕）和 `scenes.tsx`（场景编排）。
- **配音驱动时长**：每个场景多长由它的配音长度决定，音画天然同步。

## 快速开始

```bash
npm install                 # 安装依赖（首次下载无头 Chromium）
npm run audio               # 生成音效 + 所有主题的配音
npm run dev                 # 打开 Studio，左侧可切换各支视频
npm run render:browser      # 导出「从输入网址到渲染成功」
npm run render:template     # 导出模板示例片
npm run render:all          # 全部导出
```

## 新建一支分享视频

```bash
# 1. 脚手架生成目录（基于 template）
npm run new my-topic "我的分享标题"

# 2. 按提示把 myTopicVideo 加进 src/videos/index.ts 的 VIDEOS 数组

# 3. 编辑内容
#    - src/videos/my-topic/narration.json   文案 + 字幕
#    - src/videos/my-topic/scenes.tsx        选原型、填数据、排顺序

# 4. 生成这支视频的配音（时长自动写回 audioMeta.json）
npm run audio my-topic

# 5. 预览 / 导出
npm run dev
npx remotion render my-topic out/my-topic.mp4
```

<!-- APPEND -->

## 目录结构

```
video-studio/
├── scripts/
│   ├── gen_sfx.py           # 合成共享音效（纯 Python，无需 ffmpeg）
│   ├── gen_audio.py [主题]   # 生成配音 + 回写 audioMeta.json（不带参数=全部主题）
│   └── new_video.mjs        # 脚手架：新建一个主题目录
├── public/audio/
│   ├── sfx/                 # 共享音效
│   └── <主题>/narration/     # 各主题配音（按主题命名空间，互不冲突）
└── src/
    ├── Root.tsx             # 遍历 videos 注册表，为每支视频注册 Composition
    ├── framework/           # ★ 公共框架（复用，一般不用改）
    │   ├── theme.ts         # 结构色/字体 + 调色板类型 makePalette
    │   ├── palette.tsx      # 主题配色上下文 usePalette
    │   ├── types.ts         # VideoDef / SceneEntry 等类型
    │   ├── Video.tsx        # 通用合成：串联场景 + 过渡 + 音画
    │   ├── components/      # Background / SceneHeader / Captions / SceneAV / ui
    │   └── scenes/          # 6 种场景原型 + _Blank 骨架
    └── videos/              # ★ 每次分享一个目录
        ├── index.ts         # 主题注册表（新增视频加一行）
        ├── template/        # 模板示例（复制我做新视频）
        └── browser-journey/ # 示例：从输入网址到渲染成功
            ├── video.tsx    # VideoDef
            ├── scenes.tsx   # 场景编排
            ├── narration.json / audioMeta.json
            └── scenes/      # 本主题专属的自定义场景
```

## 场景原型（在 `framework/scenes/`）

数据驱动，填 props 即用：`TitleScene`（标题）、`ListScene`（要点列表）、`PipelineScene`（流程）、`ExchangeScene`（交互/通信）、`CodeScene`（代码卡）、`RecapScene`（回顾）。需要全新样式时，复制 `_Blank.tsx` 到你的主题目录下自建（像 `browser-journey/scenes/` 那样）。

一支视频可以**混用**：既用框架通用原型，也放自己的专属场景（`browser-journey` 就是 9 个专属场景）。

## 每支视频独立配色

在该主题的 `video.tsx` 里传 `palette` 即可整体换肤，不填就用默认：

```tsx
import { makePalette } from "../../framework/theme";

export const myTopicVideo: VideoDef = {
  id: "my-topic",
  title: "我的分享",
  palette: makePalette({ accent: "#ff7a59", accent2: "#ffb23e" }), // 暖橙主题
  scenes: SCENES,
  narration,
  audioMeta,
};
```

框架里所有通用原型、背景光晕、标题渐变都会自动跟随这套 palette。

## 音效与字幕

- **过场音**：场景切换自动播 `whoosh`。
- **节点音效**：在 `scenes.tsx` 给场景加 `sfx: [{ file, at, volume }]`，`at` 是该场景本地帧。可用：`whoosh`、`ding`、`ding-bright`、`type`（`public/audio/sfx/`）。
- **字幕**：自动取该主题 `narration.json` 的 `captions`，按字数加权铺到时间轴。

## 依赖环境

Node 18+、Python 3、macOS（配音用系统 `say`）。音效纯 Python 合成，**不需要 ffmpeg**。

> Remotion 对 4 人及以上公司团队为商业授权，个人与小团队免费，商用前请确认 License。

