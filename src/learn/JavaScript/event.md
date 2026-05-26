---
icon: akar-icons:file
date: 2026-05-25
order: 3
category:
  - JavaScript
---

# 事件(冒泡、捕获、委托)

DOM 标准事件流触发的先后顺序为：

1. 先捕获再冒泡。即当触发dom事件时，会先进行**事件捕获**，
2. 捕获到事件源之后通过实践传播进行**事件冒泡**

`addEventListener`的第三个参数

在我们平常用的addEventListener方法中，一般只会用到两个参数，一个是需要绑定的事件，另一个是触发事件后要执行的函数，然而addEventListener还可以传入第三个参数：

```js
element.addEventListener(event, function, useCapture);

```

第三个参数默认值是false，表示在事件冒泡阶段调用事件处理函数;如果参数为true，则表示在事件捕获阶段调用处理函数。如果不写第三个参数则默认在事件冒泡阶段调用事件处理函数。

## 事件冒泡

当一个元素接受到事件的时候，会把他接收到的事件传给自己的父级，一直到window（仅仅代表事件）

事件的传递由里到外

::: tip 阻止冒泡

```js
dom.addEventListener("xxx", () => {
  event.stopPropagation();
  xxx();
});
```

:::

## 事件捕获

当鼠标点击或者触发dom事件时 浏览器会从跟节点开始 => 事件源 （由外向内），最大的不同在于实践传播的方向

比如第三个参数设置为true 也就意味着在事件捕获阶段调用处理函数

```html
<div class="big">
  <div class="middle">
    <div class="small">我是div</div>
  </div>
</div>
<script>
  document.querySelector(".big").addEventListener("click", () => {
    console.log("big" + "冒泡");
  });
  document.querySelector(".middle").addEventListener("click", () => {
    console.log("middle" + "冒泡");
  });
  document.querySelector(".small").addEventListener("click", () => {
    console.log("small" + "冒泡");
  });
  document.querySelector(".small").addEventListener(
    "click",
    () => {
      console.log("small" + "捕获");
    },
    true,
  );
  document.querySelector(".big").addEventListener(
    "click",
    () => {
      console.log("big" + "捕获");
    },
    true,
  );
  document.querySelector(".middle").addEventListener(
    "click",
    () => {
      console.log("middle" + "捕获");
    },
    true,
  );
</script>
```

结果就是

```js
big捕获;
middle捕获;
small捕获;
small冒泡;
middle冒泡;
big冒泡;
```

## 事件委托（事件代理）

不是每个子节点单独设置事件监听器，而是事件监听器设置在其父节点上，然后利用冒泡原理影响设置每个子节点。

### 优缺点

**优点**

1. 替代循环绑定事件的操作，减少内存消耗，提高性能
2. 简化了dom节点更新时，相应事件的更新。比如 新的li的事件不需要再绑定click事件

**缺点**

1. 事件委托基于冒泡，对于不冒泡的事件不支持
2. 层级过多，在冒泡过程中， 可能会被某一层阻止掉
3. 理论上委托会导致浏览器频繁调用处理函数，需要就近委托。

## 常见问题

1. 时间流基本概念
2. stopPropagation() 和 stopImmediatePropagation() 的区别
   | 方法 | 阻止冒泡 | 阻止当前元素同类监听器 | 当前监听器自身 |
   |------|---------|---------------------|--------------|
   | `stopPropagation` | ✅ | ❌ | 完整执行 |
   | `stopImmediatePropagation` | ✅ | ✅ | 完整执行 |


## 不会冒泡的事件

1. focus
2. blur
3. focusin
4. focusout
5. load
6. unload
7. stop
8. reset
9. readystatechange
10. scroll
