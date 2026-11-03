// 由 scripts/from_md.mjs 生成：三分钟学会做视频
import type { VideoDef } from "../../framework/types";
import { makePalette } from "../../framework/theme";
import { SCENES } from "./scenes";
import narration from "./narration.json";
import audioMeta from "./audioMeta.json";

export const videoFlowVideo: VideoDef = {
  id: "video-flow",
  title: "三分钟学会做视频",
  palette: makePalette({ accent: "#34d399", accent2: "#60a5fa" }),
  scenes: SCENES,
  narration,
  audioMeta,
};
