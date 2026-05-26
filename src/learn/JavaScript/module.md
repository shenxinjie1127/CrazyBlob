---
icon: akar-icons:file
date: 2026-05-13
order: 7
category:
  - JavaScript
---

# Module 模块化

模块化的好处
1. 避免命名冲突
2. 更好的分离，按需加载
3. 更高的服用性
4. 高可维护性


## 模块化的进化过程

- 全局function模式 将不同的功能封装成不同的全局函数
- 命名空间模式 将不同的功能封装成不同的命名空间
- IIFE 立即执行函数表达式 将不同的功能封装成不同的立即执行函数


## CommonJs 

Node 应用由模块组成，采用 CommonJS 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。


```js title="example.js"
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;

```

```js
var example = require('./example.js');//如果参数字符串以“./”开头，则表示加载的是一个位于相对路径
console.log(example.x); // 5
console.log(example.addX(1)); // 6

```


## ES6 官方的模块化标准

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。



