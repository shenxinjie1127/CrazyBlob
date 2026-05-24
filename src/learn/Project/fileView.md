---
icon: akar-icons:file
date: 2024-12-21
order: 7
category:
  - JavaScript
---

# 文件预览

## 什么是文件预览

文件预览是指在浏览器中直接查看各种文件内容，无需下载到本地安装对应软件才能打开。常见的场景包括：

- 邮件附件在线查看
- 文档管理系统中在线阅读
- 分享链接直接预览
- 后台管理系统展示上传的文件

## kkFileView

[kkFileView](https://www.kkview.cn/zh-cn/index.html) 是一个文件文档在线预览解决方案，使用 Spring Boot 搭建，易于部署和使用。

### 核心特性

| 特性       | 说明                                       |
| ---------- | ------------------------------------------ |
| 一键部署   | 支持 Windows、Linux 平台一键部署           |
| 快速接入   | 两行 JS 代码即可接入预览                   |
| 格式丰富   | 支持主流办公文档的在线预览                 |
| 多模式预览 | 支持 PDF、懒加载分页图、轮播图片等预览模式 |
| 独立部署   | 提供 RESTful 接口，适用于微服务场景        |

### 支持的文件格式

#### 文档类

- **Word**: doc, docx, wps, wpt
- **Excel**: xls, xlsx, et, ets
- **PowerPoint**: ppt, pptx, dps, dpt
- **PDF**: pdf
- **文本**: txt, log, json, xml, html, jsp, js, css, java, py, sh, sql, md

#### 图片类

- jpg, jpeg, png, gif, bmp, ico, webp, svg

#### 压缩包

- zip, rar, 7z, tar, gzip, bz2

#### 音视频

- 视频: mp4, avi, mov, wmv, flv, mkv
- 音频: mp3, wav, flac, ape, aac, ogg, wma

### 基本使用方式

#### 1. 引入预览组件

```html
<script src="https://cdn.kkview.cn/lib/kkfileview/4.1.0/plugin.js"></script>
```

#### 2. 创建预览容器

```html
<div id="preview-container"></div>
```

#### 3. 初始化并预览

```javascript
kkview.preview({
  url: "https://example.com/path/to/file.docx",
  container: document.getElementById("preview-container"),
  fileName: "文档名称.docx",
});
```

#### 4. 完整示例

```html
<!DOCTYPE html>
<html>
  <head>
    <title>文件预览示例</title>
  </head>
  <body>
    <div id="preview"></div>

    <script src="https://cdn.kkview.cn/lib/kkfileview/4.1.0/plugin.js"></script>
    <script>
      kkview.preview({
        url: "/api/files/document.docx",
        container: document.getElementById("preview"),
        fileName: "document.docx",
        lang: "zh-CN",
        timeout: 30000,
        onSuccess: (res) => {
          console.log("预览加载成功", res);
        },
        onError: (err) => {
          console.error("预览加载失败", err);
        },
      });
    </script>
  </body>
</html>
```

### 配置参数说明

| 参数      | 类型        | 说明                         |
| --------- | ----------- | ---------------------------- |
| url       | string      | 文件的预览地址（必填）       |
| container | HTMLElement | 预览容器的 DOM 元素（必填）  |
| fileName  | string      | 文件名称，用于显示和类型识别 |
| lang      | string      | 语言设置，默认 zh-CN         |
| timeout   | number      | 请求超时时间，单位毫秒       |
| onSuccess | function    | 预览成功回调                 |
| onError   | function    | 预览失败回调                 |

### 部署方式

kkFileView 支持多种部署方式：

1. **Windows 一键部署**：下载 Windows 版本，解压后执行 startup 脚本
2. **Linux 一键部署**：下载 Linux 版本，解压后执行 startup 脚本
3. **Docker 部署**：使用 Docker Compose 快速启动

### 适用场景

- 文档管理系统
- 电子邮件系统
- 企业内部文件共享平台
- 在线教育平台课件展示
- 电商平台商品详情页（支持 PDF 说明书等）

kkFileView 提供了开箱即用的文件预览能力，通过简单的配置即可集成到各类 Web 应用中。
