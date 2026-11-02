// 主题定义：模板示例片
import type { VideoDef } from "../../framework/types";
import { SCENES } from "./scenes";
import narration from "./narration.json";
import audioMeta from "./audioMeta.json";

export const templateVideo: VideoDef = {
  id: "template",
  title: "模板示例片",
  scenes: SCENES,
  narration,
  audioMeta,
  // palette 不填 = 使用默认配色；需要换肤时见下方示例
  // palette: makePalette({ accent: "#ff7a59", accent2: "#ffb23e" }),
};
