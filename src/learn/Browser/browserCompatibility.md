---
icon: akar-icons:file
date: 2024-11-14
order: 2
category:
  - Browser
---

# 浏览器兼容性

## CSS

### 使用 normalize.css

抹平不同浏览器自带的默认样式（如边距、行高等）差异。保留有用样式，更现代

### postcss 插件 Autoprefixer

自动添加浏览器前缀，兼容旧版浏览器。

让尚在实验阶段或非标准的 CSS 属性在各浏览器（-webkit-， -moz- 等）中生效


## JavaScript

### @vitejs/plugin-legacy

本质上是一个 Babel 插件，用于将现代 JavaScript 代码转换为旧版浏览器兼容的代码。

### 手动添加polyfill

- core-js
- regenerator-runtime