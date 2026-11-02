#!/usr/bin/env python3
# 纯 Python 合成音效（无需 ffmpeg）：whoosh 过场、ding 提示音、键盘打字声
# 输出 24kHz / 16bit / 单声道 WAV 到 public/audio/sfx/
import math, os, struct, wave, random

RATE = 24000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "sfx")
os.makedirs(OUT, exist_ok=True)


def write_wav(name, samples):
    # samples: float 列表，范围约 [-1, 1]
    path = os.path.join(OUT, name)
    w = wave.open(path, "w")
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(RATE)
    frames = bytearray()
    for s in samples:
        v = int(max(-1.0, min(1.0, s)) * 32000)
        frames += struct.pack("<h", v)
    w.writeframes(bytes(frames))
    w.close()
    print("wrote", name, round(len(samples) / RATE, 2), "s")


def env(i, n, attack=0.02, release=0.3):
    # 简单的淡入淡出包络
    t = i / RATE
    dur = n / RATE
    a = min(1.0, t / attack) if attack > 0 else 1.0
    r = min(1.0, (dur - t) / release) if release > 0 else 1.0
    return max(0.0, a) * max(0.0, r)


def whoosh():
    n = int(0.55 * RATE)
    out = []
    lp = [0.0, 0.0, 0.0, 0.0]
    for i in range(n):
        t = i / n
        # 低通平滑系数随时间增大（0.90→0.98），气流越来越闷
        a = 0.90 + 0.08 * t
        x = random.uniform(-1, 1)
        # 4 级级联低通：压掉白噪声的“沙沙”高频，只留柔和气流
        for k in range(len(lp)):
            lp[k] = lp[k] * a + x * (1 - a)
            x = lp[k]
        amp = math.sin(math.pi * t) ** 1.6  # 先升后降的气流包络
        out.append(x * amp)
    # 级联低通后幅度很小，统一归一化到柔和音量
    peak = max((abs(s) for s in out), default=1.0) or 1.0
    return [s / peak * 0.5 for s in out]


def ding(freqs, dur=0.8, decay=5.0, amp=0.5):
    n = int(dur * RATE)
    out = []
    for i in range(n):
        t = i / RATE
        s = 0.0
        for f in freqs:
            s += math.sin(2 * math.pi * f * t)
        s /= len(freqs)
        out.append(s * math.exp(-decay * t) * amp * env(i, n, 0.005, 0.05))
    return out


def typing():
    n = int(2.4 * RATE)
    out = [0.0] * n
    i = 0
    while i < n - int(0.05 * RATE):
        # 每隔约 85ms 一次按键声
        burst = int(random.uniform(0.012, 0.02) * RATE)
        lp = 0.0
        for j in range(burst):
            if i + j >= n:
                break
            x = random.uniform(-1, 1)
            lp = lp * 0.6 + x * 0.4  # 单级低通，削掉最尖的高频
            out[i + j] += lp * math.exp(-28 * (j / RATE)) * 0.22
        i += int(random.uniform(0.07, 0.1) * RATE)
    return out


random.seed(42)
write_wav("whoosh.wav", whoosh())
write_wav("ding.wav", ding([784, 1175], 0.8, 5.0, 0.45))        # 柔和提示（G5+D6）
write_wav("ding-bright.wav", ding([1047, 1568, 2093], 1.0, 4.0, 0.5))  # 明亮成功音（C6+G6+C7）
write_wav("type.wav", typing())
