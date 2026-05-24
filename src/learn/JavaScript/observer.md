---
icon: akar-icons:file
date: 2024-05-13
order: 5
category:
  - JavaScript
---

# Observer

# MutationObserver

[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)用于监听**Dom**对象的变更，包括节点属性的变化、子节点的增删改。

## 构造函数

```typescript :no-line-numbers
const observer = new MutationObserver(callback)
```

## 方法

`disconnect()`

阻止 `MutationObserver` 实例继续接收的通知，直到再次调用其 `observe()` 方法，该观察者对象包含的回调函数都不会再被调用。

`observe()`

配置 `MutationObserver` 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知。

`takeRecords()`

从 `MutationObserver` 的通知队列中删除所有待处理的通知，并将它们返回到 `MutationRecord`对象的新 `Array` 中。

## 示例

```typescript :no-line-numbers
// 选择需要观察变动的节点
const targetNode = document.getElementById("some-id");

// 观察器的配置（需要观察什么变动）
const config = {attributes: true, childList: true, subtree: true};

// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
            console.log("A child node has been added or removed.");
        } else if (mutation.type === "attributes") {
            console.log("The " + mutation.attributeName + " attribute was modified.");
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();

```

## IntersectionObserver

[**IntersectionObserver**](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)提供一种异步观察目标元素与其祖先元素或者顶级文档视口交叉状态 一般用于某一个元素出现在视口中，懒加载等

### 构造函数

```typescript
const observer = new IntersectionObserver(callback, options);
```

### 属性

`IntersectionObserver.root`<Badge text="只读" />

测试交叉时，用作边界盒的元素或文档。如果构造函数未传入 root 或其值为null，则默认使用顶级文档的视口。

`IntersectionObserver.rootMargin`<Badge text="只读" />

计算交叉时添加到根边界盒的矩形偏移量，可以有效的缩小或扩大根的判定范围从而满足计算需要。此属性返回的值可能与调用构造函数时指定的值不同，因此可能需要更改该值，以匹配内部要求。所有的偏移量均可用 **像素**（`px`）或**百分比**（`%`）来表达，默认值为“0px 0px 0px 0px”。

`IntersectionObserver.thresholds`<Badge text="只读" />

一个包含阈值的列表，按升序排列，列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。当监听对象的任何阈值被越过时，都会生成一个通知（Notification）。如果构造器未传入值，则默认值为 0。

### 方法

`IntersectionObserver.disconnect()`

使 `IntersectionObserver` 对象停止监听目标。

`IntersectionObserver.observe()`

使 `IntersectionObserver` 开始监听一个目标元素。

`IntersectionObserver.takeRecords()`

返回所有观察目标的 `IntersectionObserverEntry` 对象数组。

`IntersectionObserver.unobserve()`

使 `IntersectionObserver` 停止监听特定目标元素。

### 示例

```typescript :no-line-numbers
const intersectionObserver = new IntersectionObserver((entries) => {
    // 如果 intersectionRatio 为 0，则目标在视野外，
    // 我们不需要做任何事情。
    if (entries[0].intersectionRatio <= 0) return;

    loadItems(10);
    console.log("Loaded new items");
});
// 开始监听
intersectionObserver.observe(document.querySelector(".scrollerFooter"));

```

## ResizeObserver

[**ResizeObserver**](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)接口监视 `Element` 内容盒或边框盒或者 `SVGElement` 边界尺寸的变化。。

::: tip
内容盒是盒模型放置内容的部分，这意味着边框盒减去内边距和边框的宽度就是内容盒。边框盒包含内容、内边距和边框。有关进一步阐述
:::

### 构造函数

```typescript
const observer = new ResizeObserver(callback);
```

### 方法

`ResizeObserver.disconnect()`

取消特定观察者目标上所有对 `Element` 的监听。

`ResizeObserver.observe()`

开始对指定 `Element` 的监听。

`ResizeObserver.unobserve()`

结束对指定 `Element` 的监听。

### 示例

```typescript :no-line-numbers
const h1Elem = document.querySelector("h1");
const pElem = document.querySelector("p");
const divElem = document.querySelector("body > div");
const slider = document.querySelector('input[type="range"]');
const checkbox = document.querySelector('input[type="checkbox"]');

divElem.style.width = "600px";

slider.addEventListener("input", () => {
    divElem.style.width = `${slider.value}px`;
});

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        if (entry.contentBoxSize) {
            // Firefox implements `contentBoxSize` as a single content rect, rather than an array
            const contentBoxSize = Array.isArray(entry.contentBoxSize)
                ? entry.contentBoxSize[0]
                : entry.contentBoxSize;

            h1Elem.style.fontSize = `${Math.max(
                1.5,
                contentBoxSize.inlineSize / 200,
            )}rem`;
            pElem.style.fontSize = `${Math.max(
                1,
                contentBoxSize.inlineSize / 600,
            )}rem`;
        } else {
            h1Elem.style.fontSize = `${Math.max(
                1.5,
                entry.contentRect.width / 200,
            )}rem`;
            pElem.style.fontSize = `${Math.max(1, entry.contentRect.width / 600)}rem`;
        }
    }

    console.log("Size changed");
});

resizeObserver.observe(divElem);

checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        resizeObserver.observe(divElem);
    } else {
        resizeObserver.unobserve(divElem);
    }
});

```