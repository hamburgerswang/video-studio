// 由 scripts/from_md.mjs 生成（来源：md/场景描述-示例.md），请改描述文件后重新生成
import React from "react";
import type { SceneEntry } from "../../framework/types";
import { TitleScene } from "../../framework/scenes/TitleScene";
import { ListScene } from "../../framework/scenes/ListScene";
import { CodeScene } from "../../framework/scenes/CodeScene";
import { PipelineScene } from "../../framework/scenes/PipelineScene";
import { RecapScene } from "../../framework/scenes/RecapScene";

export const SCENES: SceneEntry[] = [
  {
    id: "title",
    node: (
      <TitleScene
        kicker={"上手指南 · video-studio"}
        title={"三分钟\n学会做视频"}
      />
    ),
  },
  {
    id: "files",
    node: (
      <ListScene
        step={1}
        total={3}
        title={"只需要一个文件"}
        subtitle={"场景描述文件，用 Markdown 写"}
        items={[{"label":"场景","desc":"每个场景以二级标题开头，写上类型"},{"label":"画面","desc":"标题、列表、代码，按类型填写"},{"label":"旁白","desc":"配音文案和字幕写在一起"}]}
      />
    ),
  },
  {
    id: "command",
    node: (
      <CodeScene
        step={2}
        total={3}
        title={"一条命令出片"}
        subtitle={"描述文件、编号、标题"}
        filename={"终端"}
        lines={[{"text":"npm run make md/场景描述-示例.md video-flow \"三分钟学会做视频\""}]}
      />
    ),
  },
  {
    id: "steps",
    node: (
      <PipelineScene
        step={3}
        total={3}
        title={"脚本替你做完"}
        subtitle={"从描述文件到成片"}
        stages={[{"icon":"📄","name":"解析","desc":"读取描述文件"},{"icon":"🧩","name":"生成","desc":"场景代码与注册"},{"icon":"🔊","name":"配音","desc":"测出每段时长"},{"icon":"🎬","name":"导出","desc":"生成 MP4"}]}
        result={"改了描述文件，再跑一次即可"}
      />
    ),
    sfx: [{"file":"ding.wav","at":90,"volume":0.55}],
  },
  {
    id: "recap",
    node: (
      <RecapScene
        steps={["写描述","跑命令","看成片"]}
        title={"现在就试试"}
        subtitle={"复制示例，改成你的内容"}
      />
    ),
  },
];
