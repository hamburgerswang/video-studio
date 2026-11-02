// Remotion 根组件：遍历主题注册表，为每支视频注册一个 Composition
import React from "react";
import { Composition, Folder } from "remotion";
import { Video } from "./framework/Video";
import { videoDuration } from "./framework/types";
import { VIDEOS } from "./videos";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Videos">
      {VIDEOS.map((def) => {
        // 用闭包捕获 def（场景含 React 节点，不能走可序列化的 defaultProps）
        const Comp: React.FC = () => <Video def={def} />;
        return (
          <Composition
            key={def.id}
            id={def.id}
            component={Comp}
            durationInFrames={videoDuration(def)}
            fps={def.fps ?? 30}
            width={def.width ?? 1920}
            height={def.height ?? 1080}
          />
        );
      })}
    </Folder>
  );
};
