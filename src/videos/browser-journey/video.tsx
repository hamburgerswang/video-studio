// 主题定义：从输入网址到渲染成功
import type { VideoDef } from "../../framework/types";
import { SCENES } from "./scenes";
import narration from "./narration.json";
import audioMeta from "./audioMeta.json";

export const browserJourneyVideo: VideoDef = {
  id: "browser-journey",
  title: "从输入网址到渲染成功",
  scenes: SCENES,
  narration,
  audioMeta,
};
