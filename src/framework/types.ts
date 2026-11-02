// 框架公共类型
import React from "react";
import { Palette } from "./theme";

// 场景内音效线索（at 为场景本地帧）
export type SceneSfx = { file: string; at: number; volume?: number };

// 一个场景：id 对应 narration 的 key，node 是配置好的画面
export type SceneEntry = {
  id: string;
  node: React.ReactNode;
  sfx?: SceneSfx[];
};

// 旁白 + 字幕
export type NarrationItem = { text: string; captions: string[] };

// 配音时长元数据（由 scripts/gen_audio.py 生成）
export type AudioMeta = Record<string, { durationInFrames: number; seconds: number }>;

// 一支视频（一次分享）的完整定义
export type VideoDef = {
  id: string; // Composition id，同时作为音频命名空间 public/audio/<id>/
  title: string; // Studio 中显示的标题
  fps?: number; // 默认 30
  width?: number; // 默认 1920
  height?: number; // 默认 1080
  palette?: Palette; // 可选的主题配色
  scenes: SceneEntry[];
  narration: Record<string, NarrationItem>;
  audioMeta: AudioMeta;
};

// 相邻场景之间的淡入淡出过渡时长（帧）
export const TRANSITION_FRAMES = 18;

// 计算一支视频的总帧数
export const videoDuration = (def: VideoDef) => {
  const sum = def.scenes.reduce((acc, s) => acc + (def.audioMeta[s.id]?.durationInFrames ?? 150), 0);
  return sum - (def.scenes.length - 1) * TRANSITION_FRAMES;
};
