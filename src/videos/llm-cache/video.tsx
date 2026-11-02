// 主题定义：LLM 缓存机制深度解析
import type { VideoDef } from "../../framework/types";
import { makePalette } from "../../framework/theme";
import { SCENES } from "./scenes";
import narration from "./narration.json";
import audioMeta from "./audioMeta.json";

export const llmCacheVideo: VideoDef = {
  id: "llm-cache",
  title: "LLM 缓存机制",
  // 青→靛的"提速/高效"配色
  palette: makePalette({ accent: "#22d3ee", accent2: "#818cf8" }),
  scenes: SCENES,
  narration,
  audioMeta,
};
