---
icon: akar-icons:file
date: 2024-04-27
order: 1
category:
  - Package
---

# 工程化

工程化的起步是因为出现了模块化，有了模块化就有了很多第三方库，为了方便管理这些库，就出现了包管理器npm


工程化出现的历史
1. 模块化
2. 第三方库
3. 包管理器npm
4. 代码检查工具 eslint
5. babel  版本兼容工具
6. css 预编译器 sass less
7. css 后处理器 postcss  兼容性
8. 构建工具 webpack  vite  将源码转化为dist中的浏览器代码 中间调用各种插件 转化css js png 等

一个入口，有一张依赖图

## 主要解决的问题
1. 扩展代码编写
2. 使用最新的方式编写

## COMMOMJS ESM

把每一个js文件看做是一个模块
1. 全局污染问题
2. 依赖混乱问题

### 语言的问题JS

1. 兼容性问题
   1. API 兼容 polyfill： core-js
   2. 语法增强 syntax transformer jsx
2. 语法增强问题

#### 整合工具 babel  swc

`@babel/preset-env`
`swc(rust)`

### CSS

1. 语法缺失（循环 判断 拼接）
2. 功能缺失（颜色函数，数学函数，自定义函数）

