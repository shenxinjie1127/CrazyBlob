icon: akar-icons:file
date: 2026-03-31
order: 3
category:

- Vite

---

# Vite 构建过程 | 实现原理

## 开发构建

- 项目初始化 读取解析 vite.config.ts 配置文件。
- 启动开发服务 基于express 启动http 服务器。
- ESM 支持：利用浏览器原生ESM 进行模块加载。
- 按需编译： 实时编译请求的模块。
- HMR: 通过WebSocket 实现模块的局部更新。
- Source Maps： 自动生成source map 文件，方便调试。

## 生产构建

- 项目初始化: 读取并解析 vite.config.ts 配置文件。
- 分析入口: (和webpack 一样) 使用rollup 构建模块依赖图
- 插件处理: 通过插件系统进行代码转换、压缩和资源处理。
- Tree Shaking： 移除未使用的代码
- 代码拆分: 将代码拆分成多个模块。
- 生成输出: 打包生成最终的输出文件。
- 资源优化: 优化css 和 静态资源
- 缓存策略: 位静态资源添加内容哈希， 便于缓存管理


## Rollup 具体构建过程

### 1. 构建阶段

1. 读取并解析 vite.config.ts 配置文件。初始化
2. moduleLoader 构建模块图
    - 读取入口
    - 创建module 实例
    - 加载和转化代码
    - 解析ast 收集依赖
3. 拓扑排序
4. 做tree-shaking 标记
