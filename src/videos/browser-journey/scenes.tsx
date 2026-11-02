// browser-journey 的场景编排（使用本主题专属的自定义场景）
import React from "react";
import type { SceneEntry } from "../../framework/types";
import { IntroScene } from "./scenes/IntroScene";
import { UrlParseScene } from "./scenes/UrlParseScene";
import { DnsScene } from "./scenes/DnsScene";
import { TcpScene } from "./scenes/TcpScene";
import { TlsScene } from "./scenes/TlsScene";
import { RequestScene } from "./scenes/RequestScene";
import { ServerScene } from "./scenes/ServerScene";
import { RenderScene } from "./scenes/RenderScene";
import { OutroScene } from "./scenes/OutroScene";

export const SCENES: SceneEntry[] = [
  { id: "intro", node: <IntroScene />, sfx: [{ file: "type.wav", at: 2, volume: 0.5 }] },
  { id: "url", node: <UrlParseScene /> },
  { id: "dns", node: <DnsScene /> },
  { id: "tcp", node: <TcpScene /> },
  { id: "tls", node: <TlsScene />, sfx: [{ file: "ding.wav", at: 92, volume: 0.6 }] },
  { id: "request", node: <RequestScene /> },
  { id: "server", node: <ServerScene />, sfx: [{ file: "ding.wav", at: 78, volume: 0.55 }] },
  { id: "render", node: <RenderScene />, sfx: [{ file: "ding-bright.wav", at: 108, volume: 0.6 }] },
  { id: "outro", node: <OutroScene />, sfx: [{ file: "ding-bright.wav", at: 70, volume: 0.55 }] },
];
