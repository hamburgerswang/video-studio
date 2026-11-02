// 通用合成：由一个 VideoDef 渲染出完整视频（场景串联 + 过渡 + 配音/音效/字幕）
import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Background } from "./components/Background";
import { SceneAV } from "./components/SceneAV";
import { PaletteProvider } from "./palette";
import { VideoDef, TRANSITION_FRAMES } from "./types";

export const Video: React.FC<{ def: VideoDef }> = ({ def }) => {
  return (
    <PaletteProvider palette={def.palette}>
      <AbsoluteFill>
        {/* 贯穿全片的动态背景 */}
        <Background />

        <TransitionSeries>
          {def.scenes.map((scene, i) => {
            const duration = def.audioMeta[scene.id]?.durationInFrames ?? 150;
            const captions = def.narration[scene.id]?.captions ?? [];
            return (
              <React.Fragment key={scene.id}>
                <TransitionSeries.Sequence durationInFrames={duration}>
                  <SceneAV
                    videoId={def.id}
                    sceneId={scene.id}
                    index={i}
                    durationInFrames={duration}
                    captions={captions}
                    sfx={scene.sfx}
                  >
                    {scene.node}
                  </SceneAV>
                </TransitionSeries.Sequence>
                {i < def.scenes.length - 1 ? (
                  <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </TransitionSeries>
      </AbsoluteFill>
    </PaletteProvider>
  );
};
