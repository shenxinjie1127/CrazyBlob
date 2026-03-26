---
icon: akar-icons:file
date: 2026-02-03
order: 1
category:
  - Vite
  - Project
---

# Vite 打包优化

## 基础

### 生产环境移除 debugger console.log

```ts
export default defineConfig({
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false, // 不自动移除所有 console
        pure_funcs: ["console.log", "console.info", "console.debug"], // 只移除指定的
        drop_debugger: true,
      },
    },
  },
});
```

### tree-shaking

vite 默认支持 tree-shaking，即移除未使用的代码。 但是需要确保代码是ESM格式的。

### 生产环境关闭source-map

## 分包

### 懒加载分包 自动分分包

### 手动分包

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将第三方库分离
          "element-plus": ["element-plus"],
          "vue-core": ["vue", "vue-router", "pinia"],
        },
      },
    },
  },
});
```

优点：

1. 充分利用缓存技术 首次加载后，浏览器会缓存这些文件，后续加载时会直接从缓存中读取，避免重复请求。
2. 按需加载 只有当用户访问到某个路由时，才会加载该路由对应的代码，而不是全部加载。

缺点：

1. 增加了 HTTP 请求数量 因为每个分包都是一个单独的文件，所以会增加 HTTP 请求数量。
2. 增加了代码体积 每个分包都包含了所有的依赖项，所以会增加代码体积。

```
不合理的分包:              合理的分包:
┌─────────────────┐       ┌─────────────────┐
│    vendor.js    │       │    vue.js       │  (不变)
│    (3MB)        │       │    500KB        │
│  包含所有库      │       ├─────────────────┤
└─────────────────┘       │  element-ui.js  │  (不变)
                          │    1MB          │
                          ├─────────────────┤
                          │   index.js      │  (频繁更新)
                          │   50KB          │
                          └─────────────────┘

用户访问:                  用户更新后:
┌─────────────────┐       ┌─────────────────┐
│ vue.js ✅ 缓存   │       │ index.js 重新下载│
│ element ✅ 缓存  │       │ vue.js 使用缓存  │
│ index.js 新下载 │       │ element ✅ 缓存   │
└─────────────────┘       └─────────────────┘

```

## 依赖预构建

优化的是 开发服务器启动速度 和 模块解析性能

1. 在开发阶段，Vite 的开发服务器将所有的代码视为原生的ES模块，因此，vite 需要将Commonjs 或 UMD 转化为ES 模块。
2. 性能优化：将大量内部模块的ESM 依赖项转化为单个模块，减少HTTP 请求数量。

主要作用：

1. 加快启动 首次启动时间大福缩短
2. 加快热更新 HRM 更快
3. 格式转化 将CJS 转化为 ESM
4. 减少请求数量 合并多个模块为单个模块，减少HTTP 请求数量。

## 静态资源处理

### 图片处理

**vite 内置的处理方式**

1. `assetsInlineLimit` 小于该值的图片会被转化为 base64 编码，大于该值的图片会被单独打包。
2. 文件名hash ：引用资源会生成带hash的文件名，有利于缓存

**图片压缩插件**

1. `vite-plugin-imagemin` 可以压缩图片，减少图片体积。

```ts
import viteImagemin from "vite-plugin-imagemin";
viteImagemin({
  gifsicle: { optimizationLevel: 7, interlaced: false },
  optipng: { optimizationLevel: 7 },
  mozjpeg: { quality: 20 },
  pngquant: { quality: [0.8, 0.9], speed: 4 },
  svgo: {
    plugins: [
      { name: "removeViewBox" },
      { name: "removeEmptyAttrs", active: false },
    ],
  },
});
```

**图片CDN 加速**

## 资源压缩

`vite-plugin-compression` 可以压缩静态资源，减少资源体积。

- js/mjs
- json
- css
- html

```ts
import viteCompression from "vite-plugin-compression";
viteCompression({
  verbose: true,
  disable: false,
  threshold: 10240,
  algorithm: "gzip",
  ext: ".gz",
});
```

## 依赖分析工具

`rollup-plugin-visualizer` 可以分析打包后的依赖关系，可视化展示。

```ts
import { visualizer } from "rollup-plugin-visualizer";
export default defineConfig({
  plugins: [
    visualizer({
      filename: "dist/stats.html", // 生成可视化报告
      open: true,
    }),
  ],
});
```
