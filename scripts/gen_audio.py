#!/usr/bin/env python3
# 生成配音（macOS say，中文语音）并计算每个场景应有的帧数
# 用法：
#   python3 scripts/gen_audio.py <主题>   # 只生成某个主题
#   python3 scripts/gen_audio.py          # 生成 src/videos 下的所有主题
# 读取 src/videos/<主题>/narration.json -> 输出 public/audio/<主题>/narration/*.wav
#          -> 写 src/videos/<主题>/audioMeta.json
import glob, json, math, os, subprocess, sys, wave

ROOT = os.path.join(os.path.dirname(__file__), "..")
VIDEOS_DIR = os.path.join(ROOT, "src", "videos")

FPS = 30
HEAD_PAD = 12   # 配音开始前的留白帧（避开过场淡入）
TAIL_PAD = 22   # 配音结束后的呼吸留白帧
VOICE = "Tingting"
SPEAK_RATE = "192"  # 语速（词/分）
RATE = "24000"


def gen_topic(topic: str):
    narr_path = os.path.join(VIDEOS_DIR, topic, "narration.json")
    if not os.path.exists(narr_path):
        print(f"跳过 {topic}：找不到 {narr_path}")
        return
    out_dir = os.path.join(ROOT, "public", "audio", topic, "narration")
    os.makedirs(out_dir, exist_ok=True)

    with open(narr_path, encoding="utf-8") as f:
        narration = json.load(f)

    meta = {}
    print(f"[{topic}]")
    for sid, item in narration.items():
        wav = os.path.join(out_dir, f"{sid}.wav")
        subprocess.run(
            ["say", "-v", VOICE, "-r", SPEAK_RATE, "-o", wav, "--file-format=WAVE", f"--data-format=LEI16@{RATE}", item["text"]],
            check=True,
        )
        w = wave.open(wav)
        seconds = w.getnframes() / w.getframerate()
        w.close()
        frames = HEAD_PAD + math.ceil(seconds * FPS) + TAIL_PAD
        meta[sid] = {"durationInFrames": frames, "seconds": round(seconds, 2)}
        print(f"  {sid:10s} {seconds:5.2f}s -> {frames} 帧")

    with open(os.path.join(VIDEOS_DIR, topic, "audioMeta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)


def main():
    if len(sys.argv) > 1:
        topics = [sys.argv[1]]
    else:
        topics = sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob(os.path.join(VIDEOS_DIR, "*", "narration.json")))
    for t in topics:
        gen_topic(t)


if __name__ == "__main__":
    main()
