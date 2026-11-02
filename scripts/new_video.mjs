#!/usr/bin/env node
// 脚手架：基于 _template 新建一个主题目录
// 用法：node scripts/new_video.mjs <id> "<标题>"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const [, , id, title] = process.argv;
if (!id) {
  console.error('用法: node scripts/new_video.mjs <id> "<标题>"');
  process.exit(1);
}

const dest = path.join(root, "src", "videos", id);
if (fs.existsSync(dest)) {
  console.error(`目录已存在: ${dest}`);
  process.exit(1);
}

const tpl = path.join(root, "src", "videos", "template");
fs.mkdirSync(dest, { recursive: true });

// 复制 scenes.tsx 与 narration.json 作为起点
fs.copyFileSync(path.join(tpl, "scenes.tsx"), path.join(dest, "scenes.tsx"));
fs.copyFileSync(path.join(tpl, "narration.json"), path.join(dest, "narration.json"));
fs.writeFileSync(path.join(dest, "audioMeta.json"), "{}\n");

// 生成 video.tsx
const safe = (title ?? id).replace(/"/g, '\\"');
const camel = id.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
fs.writeFileSync(
  path.join(dest, "video.tsx"),
  `// 主题定义：${safe}
import type { VideoDef } from "../../framework/types";
import { SCENES } from "./scenes";
import narration from "./narration.json";
import audioMeta from "./audioMeta.json";

export const ${camel}Video: VideoDef = {
  id: "${id}",
  title: "${safe}",
  scenes: SCENES,
  narration,
  audioMeta,
  // palette: makePalette({ accent: "#ff7a59", accent2: "#ffb23e" }),
};
`,
);

console.log(`✓ 已创建 src/videos/${id}/`);
console.log("\n接下来：");
console.log(`  1. 在 src/videos/index.ts 里 import { ${camel}Video } 并加入 VIDEOS 数组`);
console.log(`  2. 编辑 src/videos/${id}/narration.json 和 scenes.tsx`);
console.log(`  3. 运行: npm run audio ${id}`);
console.log(`  4. 预览: npm run dev   导出: npx remotion render ${id} out/${id}.mp4`);
