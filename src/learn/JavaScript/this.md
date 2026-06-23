---
icon: vscode-icons:file-type-light-db
date: 2026-05-25
order: 5
category:
  - JavaScript
---

# This 指向

this的指向，是在函数被调用的时候确定的，也就是上下文被创建的时候确定的。

同一个函数，被调用的方式不同 this 的指向就不同

在函数执行过程中，一旦this 被确定了，就不会被更改

```js
// 为了能够准确判断，我们在函数内部使用严格模式，因为非严格模式会自动指向全局
function fn() {
    'use strict';
    console.log(this);
}

fn();  // fn是调用者，独立调用
window.fn();  // fn是调用者，被window所拥有
```
```js
var a = 20;
var foo = {
    a: 10,
    getA: function () {
        return this.a;
    }
}
console.log(foo.getA()); // 10

var test = foo.getA;
console.log(test());  // 20
```

```js
function foo() {
    console.log(this.a)
}

function active(fn) {
    fn(); // 真实调用者，为独立调用
}

var a = 20;
var obj = {
    a: 10,
    getA: foo
}

active(obj.getA); // 20
```

## 显示指定this 

call apply bind

```js
function fn(num1, num2) {
    console.log(this.a + num1 + num2);
}
var obj = {
    a: 20
}

fn.call(obj, 100, 10); // 130
fn.apply(obj, [20, 10]); // 50
```

### apply || call || bind

`func.apply(this, [arg1,  arg2])`

`func.call(this, arg1, agr2)`

`const newFun = func.bind(this, arg1, agr2)`






## this丢失问题
如下面的例子中，我们期待的是getA被obj调用时，this指向obj，但是由于匿名函数的存在导致了this指向的丢失，在这个匿名函数中this指向了全局，因此我们需要想一些办法找回正确的this指向。
```js
var obj = {
    a: 20,
    getA: function() {
        setTimeout(function() {
            console.log(this.a)
        }, 1000)
    }
}

obj.getA();
```
解决方式 ： 使用 self 指向 obj
```js
var obj = {
    a: 20,
    getA: function() {
        var self = this;
        setTimeout(function() {
            console.log(self.a)
        }, 1000)
    }
}
```

<!-- ## 常见的问题

1. 不同调用场景中的this指向
    - 全局作用域
    - 函数调用
    - 对象方法调用
    - 构造函数调用
    - 箭头函数
2. this手动绑定
3. 事件处理中的this


4. 实现call apply bind
5. 连续多次bind 输出的值
6. bind 多次调用，this的绑定值 -->