# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

基于 Remotion（React 渲染视频）的「分享视频工作台」：一个仓库维护多支视频。公共能力沉淀在 `src/framework/`，每支视频是 `src/videos/<主题>/` 下一个独立目录。内置中文配音（macOS `say`）、音效与字幕。

## 常用命令

```bash
npm install                      # 安装依赖（首次会下载无头 Chromium）
npm run dev                      # 打开 Remotion Studio，左侧切换各支视频
npm run audio [主题]             # 生成配音：带参数只做一个主题，不带参数做全部；同时生成音效
npm run new <id> "<标题>"        # 脚手架新建一个主题目录（基于 template）
npx remotion render <id> out/<id>.mp4   # 导出任意一支视频
npm run render:all               # 导出 browser-journey 与 template
npm run upgrade                  # 升级 Remotion
```

`npm run audio` 内部先跑 `scripts/gen_sfx.py`（合成共享音效，纯 Python 无需 ffmpeg）再跑 `scripts/gen_audio.py`（配音）。

**没有配置** lint、测试或 typecheck 脚本。校验改动靠 `npm run dev`（Studio 实时预览）或 `npx remotion render` 真实导出。类型检查可手动执行 `npx tsc --noEmit`。

## 环境要求

Node 18+、Python 3、**macOS**（配音依赖系统 `say` 命令，语音 `Tingting`）。

## 架构要点

### VideoDef 是每支视频的唯一真相源
一支视频 = 一个 `VideoDef`（见 `src/framework/types.ts`）：声明 `id`、`title`、`scenes`、`narration`、`audioMeta`、可选 `palette`。`src/Root.tsx` 遍历 `src/videos/index.ts` 的 `VIDEOS` 数组，为每个 `VideoDef` 注册一个 Composition。

因为场景是 React 节点（不可序列化），Root 用闭包 `const Comp = () => <Video def={def} />` 捕获 def，而非走 Remotion 的 `defaultProps`。

### 配音驱动时长（关键）
场景时长不是手写的，而是由配音长度决定：
- `scripts/gen_audio.py` 读 `narration.json` → 用 `say` 生成 wav → 测量时长 → 写回 `audioMeta.json`（每个场景的 `durationInFrames`）。
- `framework/Video.tsx` 和 `videoDuration()`（`types.ts`）读 `audioMeta` 决定每段 `TransitionSeries.Sequence` 的帧数与全片总长。
- **改了 `narration.json` 的文案后，必须重跑 `npm run audio <主题>`**，否则时长、字幕、音画都会错位。

### 留白常量必须两处同步
`scripts/gen_audio.py` 的 `HEAD_PAD=12` / `TAIL_PAD=22` 与 `framework/components/SceneAV.tsx` 的同名常量必须保持一致——配音在场景开头留白后才开口（避开过场淡入），字幕窗口也据此计算。改一处要改另一处，否则音画/字幕错位。

### 内容即数据，框架不常改
- `src/framework/`：引擎，一般不动。`Video.tsx`（串场景+过渡）、`SceneAV.tsx`（叠加配音/音效/字幕）、`scenes/`（6 种数据驱动场景原型 + `_Blank.tsx` 骨架）、`theme.ts` + `palette.tsx`（配色）、`components/`（Background/Captions 等）。
- `src/videos/<主题>/`：`video.tsx`(VideoDef) + `scenes.tsx`(场景编排) + `narration.json`(文案+字幕) + `audioMeta.json`(自动生成)。需要全新样式时把专属场景放在 `<主题>/scenes/`（见 `browser-journey/scenes/` 的 9 个专属场景）。一支视频可混用框架原型与专属场景。

### 配色主题化
`video.tsx` 里传 `palette: makePalette({ accent, accent2 })` 即可整体换肤；结构色（背景/文本/字体，`theme.ts`）全仓库共享不随主题变。场景内取色用 `usePalette()`（`framework/palette.tsx`），不要硬编码。

### 音效与字幕
- 过场音 `whoosh` 自动播（第一个场景除外）。
- 节点音效在 `scenes.tsx` 给 `SceneEntry` 加 `sfx: [{ file, at, volume }]`，`at` 是**场景本地帧**。可用：`whoosh`、`ding`、`ding-bright`、`type`（均在 `public/audio/sfx/`）。
- 字幕自动取 `narration.json` 的 `captions`，按字数加权铺到时间轴。
- 配音音频按主题命名空间存 `public/audio/<id>/narration/<sceneId>.wav`，各主题互不冲突。

## 新增一支视频的完整流程

1. `npm run new my-topic "我的标题"`
2. **手动**在 `src/videos/index.ts` import 并把 `myTopicVideo` 加进 `VIDEOS` 数组（脚手架不会自动改这里）。
3. 编辑 `src/videos/my-topic/narration.json`（文案+字幕）和 `scenes.tsx`（选原型或写专属场景、排顺序）。
4. `npm run audio my-topic`（生成配音并回写 `audioMeta.json`）。
5. `npm run dev` 预览 / `npx remotion render my-topic out/my-topic.mp4` 导出。

`narration.json` 的每个 key 必须与 `scenes.tsx` 里对应 `SceneEntry` 的 `id` 一致，这是关联配音、字幕、时长的纽带。
