// ============================================================
//  视频脚本：LLM 缓存机制深度解析
//  - 每个场景选一个"原型组件"填数据；id 必须与同目录 narration.json 的 key 对应
//  - 改完文案后运行 `npm run audio llm-cache`，场景时长按配音自动重算
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
    node: <TitleScene kicker="技术分享 · LLM 推理优化" title={"LLM 缓存机制\n一次讲透"} />,
  },

  // 2. 为什么要关心缓存
  {
    id: "why",
    node: (
      <ListScene
        step={1}
        total={5}
        title="为什么要关心缓存"
        subtitle="推理开销，大多花在「读进输入」上"
        items={[
          { label: "输入高度重复", desc: "System Prompt、工具定义、长文档被反复复用" },
          { label: "成本直降", desc: "长上下文场景可省 80%~90%" },
          { label: "首 token 提速", desc: "TTFT（首字延迟）降低一个数量级" },
        ]}
      />
    ),
  },

  // 3. 两层缓存
  {
    id: "layers",
    node: (
      <ListScene
        step={2}
        total={5}
        title="缓存分两层"
        subtitle="不是替代，而是叠加关系"
        items={[
          { label: "KV Cache", desc: "推理层 · 显存 · 单次请求内 · 框架自动", color: theme.accent },
          { label: "Prompt Caching", desc: "服务层 · 前缀 KV 快照 · 跨请求复用 · 调用方控制 ← 优化重点", color: theme.green },
        ]}
      />
    ),
  },

  // 4. 底层怎么存：分块 + 链式哈希
  {
    id: "storage",
    node: (
      <CodeScene
        step={3}
        total={5}
        title="底层怎么存"
        subtitle="分块存储 + 链式哈希"
        filename="前缀缓存 · block + chain hash"
        lines={[
          { text: "# 前缀切成固定大小的 block（如 16 token / 块）", color: theme.textDim },
          { text: "", color: theme.text },
          { text: "block_key = hash(", color: theme.text },
          { text: "    前面所有 block 的 hash", color: theme.accent },
          { text: "  + 当前 block 的 token 内容", color: theme.green },
          { text: ")", color: theme.text },
          { text: "", color: theme.text },
          { text: "→ 前面任何一块变，后面全部失配", color: theme.yellow },
        ]}
      />
    ),
  },

  // 5. 前缀匹配规则
  {
    id: "prefix",
    node: (
      <PipelineScene
        step={4}
        total={5}
        title="命中：从头做前缀匹配"
        subtitle="只匹配前缀，不匹配中间子串"
        stages={[
          { icon: "📜", name: "System", desc: "✓ 命中" },
          { icon: "🔧", name: "工具定义", desc: "✓ 命中" },
          { icon: "📄", name: "长文档", desc: "✓ 命中" },
          { icon: "❓", name: "本轮问题", desc: "↻ 重算" },
        ]}
        result="复用长度向下对齐到 block 边界，零头丢弃"
      />
    ),
  },

  // 6. 冷启动 → 命中（真实请求演示）
  {
    id: "exchange",
    node: (
      <ExchangeScene
        step={4}
        total={5}
        title="一次真实请求：cold → warm"
        subtitle="完全相同的请求连发两次"
        left={{ icon: "🧑‍💻", label: "调用方" }}
        right={{ icon: "🧠", label: "模型服务" }}
        messages={[
          { label: "第 1 次：相同前缀", dir: "ltr" },
          { label: "cache_creation 写入", dir: "rtl" },
          { label: "第 2 次：相同前缀", dir: "ltr" },
          { label: "cache_read 命中 · 0.1x", dir: "rtl" },
        ]}
        conclusion="✓ 相同前缀，第二次直接复用"
      />
    ),
    sfx: [{ file: "ding-bright.wav", at: 150, volume: 0.5 }],
  },

  // 7. 命中的充要条件
  {
    id: "hit",
    node: (
      <ListScene
        step={5}
        total={5}
        title="命中的四个充要条件"
        subtitle="与 session、进程、用户都无关"
        items={[
          { label: "同组织", desc: "API Key 所属 org 必须相同" },
          { label: "同模型", desc: "跨模型不共享缓存" },
          { label: "前缀一致", desc: "逐 token 完全相同" },
          { label: "在 TTL 内", desc: "默认约 5 分钟，命中自动续期" },
        ]}
      />
    ),
  },

  // 8. 黄金法则：稳定在前，动态在后
  {
    id: "practice",
    node: (
      <PipelineScene
        step={5}
        total={5}
        title="黄金法则：稳定在前，动态在后"
        subtitle="按变化频率从低到高组织 prompt"
        stages={[
          { icon: "🔧", name: "工具定义", desc: "几乎不变" },
          { icon: "📜", name: "System", desc: "几乎不变" },
          { icon: "📚", name: "长文档", desc: "偶尔变" },
          { icon: "💬", name: "对话历史", desc: "追加增长" },
          { icon: "⌨️", name: "本轮输入", desc: "每次都变" },
        ]}
        result="时间戳 / 随机 ID 绝不进开头，否则永不命中"
      />
    ),
  },

  // 9. 回顾收尾
  {
    id: "recap",
    node: (
      <RecapScene
        steps={["为什么", "两层", "存储", "命中", "实践"]}
        title="让前缀尽可能长、尽可能稳定"
        subtitle="这就是缓存优化的全部功夫"
      />
    ),
  },
];
