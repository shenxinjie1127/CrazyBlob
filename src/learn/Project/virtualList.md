---
icon: akar-icons:file
date: 2026-06-05
order: 9
category:
  - Utils
---

# 虚拟列表

**重点内容**

1. 单项行高
2. 显示的个数
3. 总的个数
4. 显示的范围所以startIndex math.floor(scrollTop.value / itemHeight.value) endIndex Math.min(startIndex.value + showListCount.value + 2, listData.value.length)
5. 显示的数据
6. 滚动条的高度

::::: sandpack#vue 虚拟列表（vueuse）

@setup

```javascript
{
  dependencies: {
    "@vueuse/core": "latest",
    "@vueuse/shared": "latest",
    "nanoid": "latest",
  }
}
```

@file /src/App.vue

```vue
<script setup>
import { ref, computed, useTemplateRef } from "vue";
import { useAsyncState, useScroll } from "@vueuse/core";
import { nanoid } from "nanoid";

// 模拟数据加载
// 数据获取
const {
  state: listData,
  isLoading,
  execute: getData,
} = useAsyncState(
  async () => {
    return [
      ...new Array(60).fill(void 0).map((item, index) => ({
        id: nanoid(),
        name: `Item` + index,
        title: `Title` + index,
      })),
    ];
  },
  [], // 初始值
  { immediate: false }, // 不立即执行
);

const scrollContainerRef = useTemplateRef("scrollContainerRef");

// 显示的个数
const showListCount = ref(10);

// 单项行高
const itemHeight = ref(60);

// 总高
const totalHeight = computed(() => listData.value.length * itemHeight.value);

// 虚拟列表的高度
const virtualContainerHeight = computed(
  () => showListCount.value * itemHeight.value,
);

const { y: scrollTop } = useScroll(scrollContainerRef);

const startIndex = computed(() => {
  return Math.floor(scrollTop.value / itemHeight.value);
});

const endIndex = computed(() => {
  return Math.min(
    startIndex.value + showListCount.value + 2,
    listData.value.length,
  );
});

const showData = computed(() => {
  if (!listData.value.length) return [];
  return listData.value.slice(startIndex.value, endIndex.value);
});

const offsetY = computed(() => startIndex.value * itemHeight.value);
</script>

<template>
  <div class="container">
    <h1>虚拟列表</h1>
    <div class="control-panel">
      <button @click="getData" class="load-btn" :disabled="isLoading">
        {{ isLoading ? "加载中..." : "获取数据" }}
      </button>

      <div class="info">
        <span>总数据量: {{ listData.length }}</span>
        <span>当前显示: {{ startIndex + 1 }} - {{ endIndex }}</span>
      </div>
    </div>
    <!-- 虚拟列表 -->
    <div
      ref="scrollContainerRef"
      class="virtual-list-wrapper"
      :style="{ height: virtualContainerHeight + 'px' }"
    >
      <!-- 占位元素，用于撑开滚动条 -->
      <div
        class="virtual-list-phantom"
        :style="{ height: totalHeight + 'px' }"
      ></div>

      <!-- 可视区域 -->
      <div
        ref="listContent"
        class="virtual-list-content"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="item in showData"
          :key="item.id"
          class="list-item"
          :style="{ height: itemHeight + 'px' }"
        >
          <div class="item-content">
            <span class="item-title">{{ item.title }}</span>
            <span class="item-id">ID: {{ item.id }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.virtual-list-wrapper {
  position: relative;
  overflow: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f5f5f5;
}
</style>
```

:::
