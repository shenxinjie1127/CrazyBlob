---
icon: akar-icons:file
date: 2024-03-01
order: 1
category:
  - Vue3
---

# Vue3 源码详解

```markmap
---
markmap:
  colorFreezeLevel: 2
---
# Vue3组成

## compiler-core
- 与平台无关的编译器核心
## compiler-dom
- 针对浏览器的编译模块
## compiler-sfc
- 针对单文件解析
## compiler-ssr
- 针对服务端渲染的编译模块
## reactivity
- 响应式系统
## template-explorer
- 用于调试编译器输出的开发工具
## vue-compat
- 迁移构建，用于兼容Vue2
## runtime-core
- 与平台无关的运行时核心
## runtime-dom
- 针对浏览器的运行时，包括dom API 属性 事件处理
## runtime-test
- 用于测试的运行时
## server-renderer
- 服务端渲染器
## shared
- 共享模块，多个包之间的共享方法、模块
## vue
- 完整版本，包括运行时和编译器
## ref-transform
- 实验性语法，ref转化器
## size-check
- 用来测试代码体积
```

## vue3 响应式数据的核心

### Composition API

在复杂的逻辑中有着明显的优势

- Composition API 在用户编写复杂逻辑业务时不会出现反复横跳问题。
- Composition API 不存在this指向不明确的问题
- Composition API 对Tree-shaking 更加友好，代码更容易压缩
- Composition API 提取公共逻辑非常方便
