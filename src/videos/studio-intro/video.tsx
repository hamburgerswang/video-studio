// 主题定义：video-studio 项目介绍
import type { VideoDef } from "../../framework/types";
import { makePalette } from "../../framework/theme";
import { SCENES } from "./scenes";
import narration from "./narration.json";
import audioMeta from "./audioMeta.json";

export const studioIntroVideo: VideoDef = {
  id: "studio-intro",
  title: "video-studio 项目介绍",
  // 紫→粉配色
  palette: makePalette({ accent: "#a78bfa", accent2: "#f472b6" }),
  scenes: SCENES,
  narration,
  audioMeta,
};
