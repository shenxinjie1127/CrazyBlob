---
icon: akar-icons:file
date: 2026-05-25
order: 3
category:
  - JavaScript
  - 优化
---

# 作用域链和闭包

## 作用域和作用域链

### 作用域

- 在js中我们可以将作用域定义为一套规则，这套规则用来管理引擎如何在当前作用域以及嵌套的子作用中根据标识符名称进行变量查找
- js中有全局作用域、函数作用域、块级作用域（ES6新增）
- 作用域和执行上下文是两个不同的概念。

执行上下文的生命周期

1. 创建

- 创建变量对象
- 建立作用域链
- 确定this指向

2. 执行

- 变量赋值
- 函数引用
- 执行其他代码

### 作用域链

作用域链，是由当前环境与上层环境的一系列变量对象组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。

## 闭包

闭包其实是由两个部分组成

1. 执行上下文A
2. 在该执行上下文中创的函数B

如果在B执行时，如果访问了A 中变量的对象值，那么闭包就产生了。

一个闭包对象，由AB 共同组成。

```js
var fn = null;
function foo() {
  var a = 2;
  function innnerFoo() {
    console.log(c); // 在这里，试图访问函数bar中的c变量，会抛出错误
    console.log(a);
  }
  fn = innnerFoo; // 将 innnerFoo的引用，赋值给全局变量中的fn
}

function bar() {
  var c = 100;
  fn(); // 此处的保留的innerFoo的引用
}

foo();
bar();
```

### 应用场景

- 柯里化
- 模块化
  模块是闭包最强大的一个应用场景。如果你是初学者，对于模块的了解可以暂时不用放在心上，因为理解模块需要更多的基础知识。但是如果你已经有了很多JavaScript的使用经验，在彻底了解了闭包之后，不妨借助本文介绍的作用域链与闭包的思路，重新理一理关于模块的知识。这对于我们理解各种各样的设计模式具有莫大的帮助。

```js
(function () {
  var a = 10;
  var b = 20;

  function add(num1, num2) {
    var num1 = !!num1 ? num1 : a;
    var num2 = !!num2 ? num2 : b;

    return num1 + num2;
  }

  window.add = add;
})();

add(10, 20);
```

### 内存泄露出现的原因

本质上就上有垃圾没有被回收 闭包= 函数 + 词法环境

1. 有本该被回收的函数没有回收，从而导致其关联的词法环境页无法被回收，最终造成内存泄漏。

```javascript
function createIncrease() {
  const doms = new Array(100000).fill(0).map((_, i) => {
    const dom = document.createElement("div");
    dom.innerHTML = i;
    return dom;
  });

  function increase() {
    doms.forEach((dom) => {
      dom.innerHTML = Number(dom.innerHTML) + 1;
    });
  }
  return increase;
}

const increase = createIncrease();

setTimeout(() => {
  increase();
  // 手动将increase函数的引用设为null，避免内存泄漏
  increase = null;
}, 1000);
```

2. 当多个函数共享词法环境时，可能会造成词法环境的膨胀，从而导致内存泄漏。

```javascript
function createIncrease() {
  const doms = new Array(100000).fill(0).map((_, i) => {
    const dom = document.createElement("div");
    dom.innerHTML = i;
    return dom;
  });

  function increase() {}
  function aaa() {
    doms.forEach((dom) => {
      dom.innerHTML = Number(dom.innerHTML) + 1;
    });
  }
  return increase;
}

const increase = createIncrease();

// 在这里其实increase函数和aaa函数共享了doms数组，导致doms数组无法被回收，从而内存泄漏
setTimeout(() => {
  increase();
  // 手动将increase函数的引用设为null，避免内存泄漏
  increase = null;
}, 1000);
```

### 闭包泄露的检测

Chrome DevTools Memory 面板

```
1. 打开 DevTools → Memory 标签
2. 选择 "Heap snapshot"
3. 在关键操作前后各拍一次快照
4. 对比两次快照之间的 "Delta"
5. 查找意外存活的闭包作用域
```

## 常见的问题

1. 你能解释什么是作用域链吗？它是如何在 JavaScript 中工作的？
2. 当一个变量在当前作用域中找不到时，JavaScript 是如何沿着作用域链查找的？它会找到什么为止？
3. 什么是闭包？能否用通俗的语言解释一下闭包的工作原理？
4. 请举例说明闭包的常见使用场景，比如数据封装、回调函数、和计数器等
   - 创建不能被外部直接访问的私有变量 只能在闭包中访问
   - 柯里化
   - 计时器
   - 防抖节流
   - 模块化 在ES6 出现之前
   - 函数缓存
5. 闭包可能导致什么样的内存问题？为什么有些闭包会导致内存泄漏？
   - 最常见的就是dom上绑定了事件，事件处理函数是一个闭包，闭包中引用了dom元素，导致内存泄漏。

```js
function mount() {
  const bigData = new Array(100_000).fill("📦");
  const btn = document.getElementById("myButton");

  btn.addEventListener("click", function () {
    console.log(bigData.length); // 闭包抓住了 bigData 和 btn
  });
}

mount();
// ❌ 即使按钮被移除 DOM，如果 listener 没被 removeEventListener，
// 整个闭包作用域（包括 bigData）都无法被回收
```

一般都需要把卸载函数返回 这样就方便清理

闭包绑定的不是某一个参数，而是外部的整个作用域，虽然V8引擎会优化闭包，但是闭包的内存泄漏问题依然存在。

```js
function createMemoizer() {
  const cache = {}; // 闭包持有这个对象
  return function (key, value) {
    if (value !== undefined) {
      cache[key] = value; // 只增不减！
    }
    return cache[key];
  };
}
const memoize = createMemoizer();
// 长期运行后 cache 可能变得巨大
for (let i = 0; i < 1_000_000; i++) {
  memoize(`key-${i}`, new Array(1000));
}
```
