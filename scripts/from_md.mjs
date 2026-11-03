#!/usr/bin/env node
// 从场景描述文件（Markdown）一键生成视频：建目录 → 注册 → 配音 → 导出
// 用法：node scripts/from_md.mjs <描述文件.md> <id> "<标题>"
// 描述文件格式见 md/场景描述格式.md
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const MARK = "// 由 scripts/from_md.mjs 生成";

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

const [, , mdFile, id, videoTitle] = process.argv;
if (!mdFile || !id || !videoTitle) fail('用法: npm run make <描述文件.md> <id> "<标题>"');
if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) fail(`id 只能用小写字母、数字和连字符: ${id}`);
if (!fs.existsSync(mdFile)) fail(`找不到描述文件: ${mdFile}`);

// ---------- 解析 ----------
// 场景类型 → 框架原型组件名
const TYPES = { title: "TitleScene", list: "ListScene", code: "CodeScene", pipeline: "PipelineScene", exchange: "ExchangeScene", recap: "RecapScene" };
// 带 SceneHeader（需要 step/total）的原型
const WITH_HEADER = ["ListScene", "CodeScene", "PipelineScene", "ExchangeScene"];

const parseBody = (lines, where) => {
  const fields = {};
  const bullets = [];
  const code = [];
  let inCode = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^```/.test(line.trim())) {
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      code.push(line);
      continue;
    }
    if (!line.trim()) continue;
    const b = line.match(/^\s*-\s+(.*)$/);
    if (b) {
      bullets.push(b[1].trim());
      continue;
    }
    const f = line.match(/^([^:：]+)[:：]\s*(.*)$/);
    if (f) {
      fields[f[1].trim()] = f[2].trim();
      continue;
    }
    fail(`${where}：无法识别这一行「${line}」`);
  }
  return { fields, bullets, code };
};

const src = fs.readFileSync(mdFile, "utf8").replace(/<!--[\s\S]*?-->/g, "");
const [preamble, ...blocks] = src.split(/^## /m);
const head = parseBody(preamble.split("\n").filter((l) => !/^#\s/.test(l)), "文件开头");
if (!blocks.length) fail("描述文件里没有场景（每个场景以「## 场景id | 类型」开头）");

const split = (s) => s.split("|").map((x) => x.trim());
const nl = (s) => (s === undefined ? undefined : s.replace(/\\n/g, "\n"));

const scenes = blocks.map((block) => {
  const [first, ...rest] = block.split("\n");
  const [sid, typeRaw] = split(first);
  const where = `场景 ${sid}`;
  if (!/^[a-zA-Z0-9_-]+$/.test(sid ?? "")) fail(`场景 id 只能用字母、数字、_ 和 -: 「${first}」`);
  const comp = TYPES[(typeRaw ?? "").toLowerCase().replace(/scene$/, "")];
  if (!comp) fail(`${where}：未知类型「${typeRaw}」，可选 ${Object.keys(TYPES).join(" / ")}`);
  const { fields: f, bullets, code } = parseBody(rest, where);
  if (!f["旁白"]) fail(`${where}：缺少「旁白」`);
  return { sid, comp, f, bullets, code };
});

const dup = scenes.map((s) => s.sid).find((s, i, a) => a.indexOf(s) !== i);
if (dup) fail(`场景 id 重复: ${dup}`);

// ---------- 组装 props ----------
const headerTotal = scenes.filter((s) => WITH_HEADER.includes(s.comp)).length;
let step = 0;

const buildProps = ({ comp, f, bullets, code }, where) => {
  const base = WITH_HEADER.includes(comp) ? { step: ++step, total: headerTotal, title: f["标题"], subtitle: f["副标题"] } : {};
  if (base.step && !base.title) fail(`${where}：缺少「标题」`);
  switch (comp) {
    case "TitleScene":
      return { kicker: f["小标题"], title: nl(f["标题"] ?? videoTitle) };
    case "ListScene":
      return { ...base, items: bullets.map((b) => ((([label, desc]) => ({ label, desc }))(split(b)))) };
    case "CodeScene":
      return { ...base, filename: f["文件名"], lines: code.map((text) => ({ text })) };
    case "PipelineScene":
      return {
        ...base,
        stages: bullets.map((b) => {
          const p = split(b);
          return p.length >= 3 ? { icon: p[0], name: p[1], desc: p[2] } : { name: p[0], desc: p[1] };
        }),
        result: f["结论"],
      };
    case "ExchangeScene": {
      const end = (s, key) => {
        if (!s) fail(`${where}：缺少「${key}」`);
        const [icon, ...label] = s.split(/\s+/);
        return { icon, label: label.join(" ") };
      };
      return {
        ...base,
        left: end(f["左"], "左"),
        right: end(f["右"], "右"),
        messages: bullets.map((b) => {
          const m = b.match(/^(->|<-)\s*(.*)$/);
          if (!m) fail(`${where}：消息要以 -> 或 <- 开头「${b}」`);
          return { label: m[2], dir: m[1] === "->" ? "ltr" : "rtl" };
        }),
        conclusion: f["结论"],
      };
    }
    case "RecapScene":
      return { steps: bullets, title: f["标题"] ?? videoTitle, subtitle: f["副标题"] };
  }
};

// 音效：「ding@78, whoosh@10」→ [{ file, at }]
const parseSfx = (s, where) =>
  s
    ? s.split(/[,，]/).map((x) => {
        const m = x.trim().match(/^([\w-]+(?:\.wav)?)@(\d+)$/);
        if (!m) fail(`${where}：音效格式应为 名称@帧，如 ding@78「${x.trim()}」`);
        return { file: m[1].endsWith(".wav") ? m[1] : `${m[1]}.wav`, at: Number(m[2]), volume: 0.55 };
      })
    : undefined;

// ---------- 生成文件 ----------
const jsx = (comp, props) => {
  const attrs = Object.entries(props)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}={${JSON.stringify(v)}}`);
  return `<${comp}\n        ${attrs.join("\n        ")}\n      />`;
};

const entries = scenes.map((s) => {
  const where = `场景 ${s.sid}`;
  const sfx = parseSfx(s.f["音效"], where);
  return [
    "  {",
    `    id: ${JSON.stringify(s.sid)},`,
    `    node: (\n      ${jsx(s.comp, buildProps(s, where))}\n    ),`,
    sfx ? `    sfx: ${JSON.stringify(sfx)},` : null,
    "  },",
  ]
    .filter(Boolean)
    .join("\n");
});

const used = [...new Set(scenes.map((s) => s.comp))];
const scenesTsx = `${MARK}（来源：${path.relative(root, path.resolve(mdFile))}），请改描述文件后重新生成
import React from "react";
import type { SceneEntry } from "../../framework/types";
${used.map((c) => `import { ${c} } from "../../framework/scenes/${c}";`).join("\n")}

export const SCENES: SceneEntry[] = [
${entries.join("\n")}
];
`;

const narration = Object.fromEntries(
  scenes.map(({ sid, f }) => [sid, { text: f["旁白"], captions: f["字幕"] ? split(f["字幕"]) : [f["旁白"]] }]),
);

const camel = id.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
const varName = `${camel}Video`;
const colors = head.fields["配色"] ? head.fields["配色"].split(/[,，\s]+/).filter(Boolean) : [];
if (colors.length && colors.length !== 2) fail("配色要写两个颜色，如「配色: #a78bfa, #f472b6」");
const videoTsx = `${MARK}：${videoTitle.replace(/\n/g, " ")}
import type { VideoDef } from "../../framework/types";
${colors.length ? 'import { makePalette } from "../../framework/theme";\n' : ""}import { SCENES } from "./scenes";
import narration from "./narration.json";
import audioMeta from "./audioMeta.json";

export const ${varName}: VideoDef = {
  id: ${JSON.stringify(id)},
  title: ${JSON.stringify(videoTitle)},
${colors.length ? `  palette: makePalette({ accent: "${colors[0]}", accent2: "${colors[1]}" }),\n` : ""}  scenes: SCENES,
  narration,
  audioMeta,
};
`;

// 已存在的目录只允许覆盖本脚本生成的，避免误删手写视频
const dest = path.join(root, "src", "videos", id);
const videoPath = path.join(dest, "video.tsx");
if (fs.existsSync(dest) && !(fs.existsSync(videoPath) && fs.readFileSync(videoPath, "utf8").startsWith(MARK))) {
  fail(`src/videos/${id}/ 已存在且不是本脚本生成的，换一个 id`);
}
fs.mkdirSync(dest, { recursive: true });
fs.writeFileSync(path.join(dest, "scenes.tsx"), scenesTsx);
fs.writeFileSync(path.join(dest, "narration.json"), JSON.stringify(narration, null, 2) + "\n");
fs.writeFileSync(videoPath, videoTsx);
if (!fs.existsSync(path.join(dest, "audioMeta.json"))) fs.writeFileSync(path.join(dest, "audioMeta.json"), "{}\n");
console.log(`✓ 已生成 src/videos/${id}/（${scenes.length} 个场景）`);

// 注册到 src/videos/index.ts
const indexPath = path.join(root, "src", "videos", "index.ts");
let index = fs.readFileSync(indexPath, "utf8");
if (!index.includes(`"./${id}/video"`)) {
  const lastImport = index.lastIndexOf("\nimport ");
  const eol = index.indexOf("\n", lastImport + 1);
  index = `${index.slice(0, eol + 1)}import { ${varName} } from "./${id}/video";\n${index.slice(eol + 1)}`;
  const anchor = "export const VIDEOS: VideoDef[] = [\n";
  if (!index.includes(anchor)) fail("src/videos/index.ts 里找不到 VIDEOS 数组，请手动注册");
  index = index.replace(anchor, `${anchor}  ${varName},\n`);
  fs.writeFileSync(indexPath, index);
  console.log(`✓ 已注册到 src/videos/index.ts`);
}

// 配音 → 导出
const run = (cmd, args) => {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: "inherit" });
  if (r.status !== 0) fail(`命令失败: ${cmd} ${args.join(" ")}`);
};
run("python3", ["scripts/gen_audio.py", id]);
run("npx", ["remotion", "render", id, `out/${id}.mp4`]);
console.log(`\n✓ 完成：out/${id}.mp4`);
