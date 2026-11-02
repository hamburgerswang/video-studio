// Remotion 构建与渲染配置
import { Config } from "@remotion/cli/config";

// 视频编码格式
Config.setVideoImageFormat("jpeg");
// 渲染并发数（根据机器 CPU 核数自动）
Config.setConcurrency(null);
// 输出覆盖已存在文件
Config.setOverwriteOutput(true);
