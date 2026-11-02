// 场景视听包装：为每个场景叠加旁白配音、过场/节点音效与字幕
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Captions } from "./Captions";
import { SceneSfx } from "../types";

// 与 scripts/gen_audio.py 中的留白保持一致
const HEAD_PAD = 12;
const TAIL_PAD = 22;

type Props = {
  videoId: string; // 音频命名空间 public/audio/<videoId>/
  sceneId: string;
  index: number;
  durationInFrames: number;
  captions: string[];
  sfx?: SceneSfx[];
  children: React.ReactNode;
};

export const SceneAV: React.FC<Props> = ({ videoId, sceneId, index, durationInFrames, captions, sfx, children }) => {
  const captionWindow = durationInFrames - HEAD_PAD - TAIL_PAD;
  const cues = sfx ?? [];
  const hasNarration = captions.length > 0;

  return (
    <AbsoluteFill>
      {/* 画面 */}
      {children}

      {/* 旁白配音：留白后再开口，避开过场淡入 */}
      {hasNarration ? (
        <Sequence from={HEAD_PAD} name={`narration-${sceneId}`}>
          <Audio src={staticFile(`audio/${videoId}/narration/${sceneId}.wav`)} />
        </Sequence>
      ) : null}

      {/* 过场气流音（第一个场景不加） */}
      {index > 0 ? <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.32} /> : null}

      {/* 场景内关键节点音效 */}
      {cues.map((c, i) => (
        <Sequence key={i} from={c.at} name={`sfx-${sceneId}-${i}`}>
          <Audio src={staticFile(`audio/sfx/${c.file}`)} volume={c.volume ?? 0.5} />
        </Sequence>
      ))}

      {/* 字幕 */}
      {hasNarration ? <Captions segments={captions} from={HEAD_PAD} durationFrames={captionWindow} /> : null}
    </AbsoluteFill>
  );
};
