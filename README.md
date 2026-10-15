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
static/refinements.css
static/app.js
static/paper-update/video-poster.jpg
static/favicon.svg
static/native/
static/native/corlpipeline.pdf
static/native/corlpipeline-tight.png
assets/TORL-VLA.pdf
assets/TORL-VLA-Appendix.pdf
assets/videos/project-video-subtitled.mp4
assets/videos/real-robot-experiments-hq.mp4
assets/videos/real-robot-experiments-h264.mp4
assets/videos/real-robot-experiments-preview.webm
```

主要文件说明：

- `index.html`：网页主体内容，包括标题、作者、按钮、视频、方法、实验、补充分析和引用。
- `static/styles.css`：基础网页样式和结果图表样式。
- `static/refinements.css`：论文文案布局、三阶段卡片、参考与路由展示、响应式导航和图片查看器样式。
- `static/app.js`：章节导航、任务视频切换、图片放大查看，以及项目视频的播放、进度和全屏控制。
- `serve.py`：本地预览服务器，支持视频 Range 请求。
- `static/paper-update/video-poster.jpg`：指定字幕视频的标题开场封面。
- `static/native/corlpipeline-tight.png`：从 `corlpipeline.pdf` 重新生成并裁掉白边的总流程图。
- `assets/TORL-VLA.pdf`：论文 PDF。
- `assets/TORL-VLA-Appendix.pdf`：补充材料 PDF。
- `assets/videos/project-video-subtitled.mp4`：当前开场字幕视频，约 64 MB，1920×1130 H.264。
- `assets/videos/real-robot-experiments-hq.mp4`：备用视频，约 77 MB，720p H.264。
- `assets/videos/real-robot-experiments-h264.mp4`：较小的 H.264 备用版本。
- `assets/videos/real-robot-experiments-preview.webm`：WebM 备用版本。
- `static/native/`：从 `/data/paper_corl/figure/` 整理出的原生高清图。

## 视频说明

开场视频使用 `/data/paper_corl/icra_new/有字幕.mp4` 的浏览器兼容转码版本：

```text
assets/videos/project-video-subtitled.mp4
```

该版本为 1920×1130、H.264/AAC，保留完整画面与字幕，时长约 2 分 56 秒，约 64 MB。封面 `static/paper-update/video-poster.jpg` 使用标题开场画面，播放器从 0:00 开始。所有任务演示视频、任务难点说明和逐段观看解释继续保留。

页面支持播放、静音、拖动进度和全屏显示。浏览器限制原生全屏时会使用页面展开模式。本地请使用 `python3 serve.py 8000`，该服务支持视频 Range 请求。

研究图片可点击放大；有 PDF 的图片在查看器内保留 PDF 入口。方法总图使用 2026-10-15 从 Overleaf 项目 `TORL-VLA: ICRA` 导出的 `icra_version_xsl/figures/corlpipeline.pdf`，保存为 `static/paper-update/method-framework.pdf`。经作者确认，仅将图内 Stage II 标题统一为 `Stage-Specific Online Reference Refinement`，沿用原图字体与字号，其余图中文字和内容保持原样。网页 PNG 按原 PDF 的 CropBox 渲染为高清图，页面同步记录图片比例并更新缓存标识。原有素材继续保留在 `static/native/`。

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
