# TORL-VLA 论文项目主页

这个目录是一套静态论文项目页，用来展示：

**TORL-VLA: Tactile Guided Online Reinforcement Learning for Contact-Rich Manipulation**

页面包含论文标题、作者单位、论文链接、实验视频、方法、实验结果、补充分析、资源链接和 BibTeX。它不需要后端服务，可以直接部署到 GitHub Pages。

## 本地预览

推荐使用项目里的 Range server，这样本地视频进度条可以正常拖动：

```bash
python3 serve.py 8000
```

然后在浏览器中打开：

```text
http://127.0.0.1:8000
```

也可以打开：

```text
http://localhost:8000
```

不要在浏览器里打开 `http://0.0.0.0:8000`。`0.0.0.0` 只是服务器监听所有网卡的绑定地址，不是正常的浏览器访问地址，有些浏览器或 IDE 代理访问它时会出现 `HTTP ERROR 502`。

如果看到：

```text
OSError: [Errno 98] Address already in use
```

说明 `8000` 端口已经被占用。可以先在之前启动服务的终端里按 `Ctrl+C` 关闭服务，或者换一个端口：

```bash
python3 serve.py 8001
```

再打开：

```text
http://127.0.0.1:8001
```

## 文件结构

```text
index.html
serve.py
static/styles.css
static/app.js
static/video-poster.jpg
static/favicon.svg
static/native/
static/native/corlpipeline.pdf
static/native/corlpipeline-tight.png
assets/TORL-VLA.pdf
assets/TORL-VLA-Appendix.pdf
assets/videos/project-video-fullframe.mp4
assets/videos/real-robot-experiments-hq.mp4
assets/videos/real-robot-experiments-h264.mp4
assets/videos/real-robot-experiments-preview.webm
```

主要文件说明：

- `index.html`：网页主体内容，包括标题、作者、按钮、视频、方法、实验、补充分析和引用。
- `static/styles.css`：网页样式、左侧目录、响应式布局和结果图表样式。
- `static/app.js`：左侧目录的滚动章节高亮，以及项目视频的自定义可拖动进度条。
- `serve.py`：本地预览服务器，支持视频 Range 请求。
- `static/video-poster.jpg`：从项目视频第一帧生成的网页视频封面。
- `static/native/corlpipeline-tight.png`：从 `corlpipeline.pdf` 重新生成并裁掉白边的总流程图。
- `assets/TORL-VLA.pdf`：论文 PDF。
- `assets/TORL-VLA-Appendix.pdf`：补充材料 PDF。
- `assets/videos/project-video-fullframe.mp4`：网页优先加载的视频，约 78 MB，720p H.264，保留完整画面和音频，支持更好的拖动体验。
- `assets/videos/real-robot-experiments-hq.mp4`：备用视频，约 77 MB，720p H.264。
- `assets/videos/real-robot-experiments-h264.mp4`：较小的 H.264 备用版本。
- `assets/videos/real-robot-experiments-preview.webm`：WebM 备用版本。
- `static/native/`：从 `/data/paper_corl/figure/` 整理出的原生高清图。

## 视频说明

网页中的视频来自：

```text
/data/paper_corl/Supplementary Material/Real-Robot Experiments.mp4
```

原始视频约 136 MB，是 HEVC 编码。网页中优先使用重新转码后的：

```text
assets/videos/project-video-fullframe.mp4
```

该版本使用 ffmpeg 保留完整画面并重新编码到 1280x720、30fps、H.264、faststart，设置约 0.5 秒关键帧间隔，文件大小约 78 MB。原始视频本身是 720p，因此网页视频不能真正提升到原生 1080p；现在的版本主要优化了浏览器兼容、可拖动性、首帧加载和视觉锐度。

页面使用单一自定义视频控制栏，拖动进度条会直接跳转 `video.currentTime`。正式发布到 GitHub Pages 后，视频拖动通常会由静态托管服务正常支持。本地预览时请使用 `python3 serve.py 8000`，不要用 `python3 -m http.server` 来判断视频进度条是否可拖动。如果浏览器仍显示旧视频或旧封面，请强制刷新页面缓存。

## 相关代码链接

页面里加入了我们前期开源的 RLT 复现工作链接：

```text
https://github.com/Yyshadow/openpi-RLT
```

这个链接不是本网页项目的代码仓库，也不是 TORL-VLA 官方代码发布；它指向我们前期的 RLT 复现实现，用于引导对 reference-guided online refinement / RLT 方向感兴趣的读者先关注这个开源实现。

## GitHub Pages 发布方法

### 方式一：个人或组织主页

创建一个仓库，名称为：

```text
YOUR_NAME.github.io
```

把当前目录下的所有文件放到仓库根目录，推送到 GitHub 后，页面通常会发布到：

```text
https://YOUR_NAME.github.io/
```

### 方式二：普通项目主页

创建一个普通仓库，例如：

```text
torl-vla-project-page
```

把当前目录下的所有文件推送到这个仓库，然后在 GitHub 中打开：

```text
Settings -> Pages -> Build and deployment -> Deploy from a branch -> main / root
```

开启后，页面通常会发布到：

```text
https://YOUR_NAME.github.io/torl-vla-project-page/
```

## 发布前需要检查

- 确认论文链接是否使用当前的 `assets/TORL-VLA.pdf`。
- 确认补充材料链接是否使用当前的 `assets/TORL-VLA-Appendix.pdf`。
- 确认 arXiv 链接是否保持为 `https://arxiv.org/abs/2606.09337`。
- 如果 TORL-VLA 官方代码仓库公开了，可以再单独加入正式 `Code` 链接；当前 `Our RLT Repro` 指向的是我们前期开源的 RLT 复现工作。
- 如果论文标题、作者、单位或 BibTeX 有更新，需要同步修改 `index.html`。
- 如果最终视频改为外部托管，需要替换 `index.html` 中的视频区域。

## 常见修改位置

修改标题、作者、单位：

```text
index.html
```

修改页面样式：

```text
static/styles.css
```

替换论文或补充材料：

```text
assets/TORL-VLA.pdf
assets/TORL-VLA-Appendix.pdf
```

替换网页视频：

```text
assets/videos/
```
