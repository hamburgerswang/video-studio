// 主题注册表：每新增一支视频，import 后加到 VIDEOS 数组即可
import type { VideoDef } from "../framework/types";
import { llmCacheVideo } from "./llm-cache/video";
import { browserJourneyVideo } from "./browser-journey/video";
import { templateVideo } from "./template/video";
import { studioIntroVideo } from "./studio-intro/video";
import { videoFlowVideo } from "./video-flow/video";

export const VIDEOS: VideoDef[] = [
  videoFlowVideo,
  studioIntroVideo,
  llmCacheVideo,
  browserJourneyVideo,
  templateVideo,
];
