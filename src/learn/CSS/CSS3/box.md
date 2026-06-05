---
icon: akar-icons:file
date: 2026-05-29
order: 2
category:
  - CSS
---

# 盒子模型

## 盒子模型的组成部分

- content(内容)
盒子中实际显示的文本或图像部分，内容去的大小由width 和 height 属性确定
- 内边距
内容与边框之间的空间。它用于增加内容与边框之间的距离
- 边框
- 外边距

## 标准盒子与替代盒子

- 标准盒子  width 和 height 只包含内容区，不包含内边距、外边距、边框。因此元素实际占用空间为width + padding + border
- 替代盒子  width 和 height 包含内边距、边框。因此元素实际占用空间为width


## 盒子模型的计算

**标准盒子**
总宽度 = width + padding-left + padding-right + border-left + border-right
总高度 = height + padding-top + padding-bottom + border-top + border-bottom
***代替盒子*
总宽度 = width （包括内边距和边框）
总高度 = height （包括内边距和边框）
