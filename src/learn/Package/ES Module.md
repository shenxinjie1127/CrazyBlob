---
icon: akar-icons:file
date: 2026-04-27
order: 3
category:
  - Package
---

# ES Module

官方出品的模块化标准

## 如何导出
ES Module 的导出
- 具名导出（普通导出），可以导出多个
- 默认导出，只能导出一个


一个模块可以同时存在两种导出方式，最终会合并为一个【对象】导出
```javascript
export const a  =1  // 具名 常用
export function a () {}

const d = 2
export {d} // 具名

const f =4, g=5
export {f, g as default} // 基本 + 默认


/**
 *  {
 *   default: xx // 默认导出只有一个
 *   a:1  // 具名导出可以多个 但key 不能重复
 * }
 */
```

## 动态导入

```javascript
import('./xxx.js').then(math => {
    math.xxx
})

```