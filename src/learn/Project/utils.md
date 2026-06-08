---
icon: akar-icons:file
date: 2023-10-08
order: 11
category:
  - Utils
---

# 好用的工具库积累

### 拖拽库 [interactjs](https://interactjs.io/)

#### 优势

1. 轻量 无其他依赖 性能高
2. 功能强大 支持拖拽、缩放、旋转等操作
3. 易于使用 简单的 API 设计，上手快
4. 浏览器兼容好（Chrome/Firefox/Safari/Edge）

#### 缺点

1. 功能相对基础，不会包含排序，拖拽生成，树形拖拽等高级功能
2. 复杂场景需要大量自定义开发

#### 使用场景

1. 低代码中的拖拽生成
2. 较为简单的拖拽效果

### 排序库 [sortablejs](https://sortablejs.github.io/Sortable/)

#### 优势

1. 兼容性好，并且支持触屏设备
2. 简单的 API，方便使用
3. 基于原生，零依赖，性能优越
4. 支持树形拖拽

#### 缺点

1. 不支持 IE11 及以下版本

#### 场景

1. 列表排序
2. 树形结构排序

### vue 组合式工具集 [vueuse](https://vueuse.nodejs.cn/)

#### 优势

1. 提供了丰富的组合式 API，方便在 Vue 项目中使用
2. 支持 Vue 3 Composition API，与 Vue 3 生态系统无缝集成
3. 提供了许多常用的功能，如响应式状态管理、事件处理、DOM 操作等

#### 一些常用场景

1. useFocus 监听元素是否获得焦点
2. useElementVisibility 跟踪元素的可见性（相对于视口）
3. useIntersectionObserver 对于 InterSectionObserver 的封装
4. useResizeObserver 跟踪元素尺寸的变更
5. useWebWorkerFn 创建额外的线程去执行复杂计算逻辑，避免阻塞 UI 的渲染

### icon 库

#### @iconify-icons

在 Vue 中使用需要结合 @iconify/vue 库

```vue
<template>
  <div>
    <Icon :icon="xxx" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import xxx from "@iconify-icons/ep/arrow-right";
</script>
```

在 React 中使用需要结合 @iconify/react 库

```tsx
import { Icon } from "@iconify/react";
import xxx from "@iconify-icons/ep/arrow-right";

const App = () => {
  return (
    <div>
      <Icon icon={xxx} />
    </div>
  );
};
```

### 前端 Excle 操作库 [xlsx](https://docs.sheetjs.com/docs/)

#### 基础用法

```ts
const xlsx = require("xlsx");
const workbook = xlsx.utils.book_new();
// 合并表头和行数据
const header = ["翻译键", ...langs];
const excelData = [header, ...rows];
const worksheet = xlsx.utils.aoa_to_sheet(excelData);
// 调整列宽（可选，优化显示效果）
worksheet["!cols"] = [
  { wch: 30 }, // 翻译键列宽
  ...langs.map(() => ({ wch: 20 })), // 各语言列宽
];
// 添加工作表并保存
xlsx.utils.book_append_sheet(workbook, worksheet, "多语言翻译");
xlsx.writeFile(workbook, path.resolve(__dirname, outputPath));
```

### 日期处理工具 [dayjs](https://dayjs.fenxianglu.cn/category/)

#### 时区设置

```ts
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // 依赖 utc 插件
dayjs.extend(utc);
dayjs.extend(timezone);

//设置默认时区
// 所有日期操作都将基于此时区
dayjs.tz.setDefault("America/New_York");
```

#### 转化

`dayjs.format("YYYY-MM-DD HH:mm:ss ZZ");`

### 图表库 [echarts](https://echarts.apache.org/zh/index.html)
