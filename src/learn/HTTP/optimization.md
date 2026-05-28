---
icon: akar-icons:file
date: 2026-05-27
order: 1
category:
  - HTTP
---

# 网络性能优化

## 请求数量优化

### 1. 合理的拆分和合并资源

- 按需加载  路由懒加载 | 组件异步加载 只加载当前页面需要的资源
- 资源合并  合并多个资源文件，减少请求次数 比如 将vue + element + pinia + axios 合并成一个文件
- 服务端渲染/预渲染： 减少首屏资源请求压力


### 2. 使用缓存避免重复请求

- 使用浏览器缓存控制（Cache-control/ETag/Last-Modified）
- 对于不变的资源，设置强缓存
- 对于接口返回的数据做缓存，避免重复请求 
- 本地缓存  本地存储（localStorage）或会话存储（sessionStorage）indexDB


## 资源体积压缩

### 1. 压缩与代码优化

- 启用gzip 压缩静态资源（html/css/js）
- 压缩图片资源
- 减少polyfill 体积 按需引入core-js
- 移除无用的代码

### 2. 精简传输内容

- 分页
- 减少返回的无用字段


## 加载顺序和优先级优化

### 1. 关键资源优先加载
- 使用preload、prefetch等提示浏览器提前加载
- 使用打包工具控制资源加载顺序


### 2. 非关键资源延迟加载

- 图片懒加载（loading="lazy" | IntersectionObserver）
- JS 异步加载（async | defer）
