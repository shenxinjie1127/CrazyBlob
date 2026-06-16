---
icon: akar-icons:file
date: 2026-05-25
order: 6
category:
  - JavaScript
---

# 异步编程

历史

- callback
- es6 promise then 链式调用 generator yield next
- es7 async await

同步： 在某段代码执行的时候，在没有得到返回结果前，其他代码是无法执行的
异步： 在某一段代码异步调用发出后，这个代码不会立刻得到返回结果，而是在异步调用发出后通过某些回调函数的处理拿到结果，异步函数不会阻塞后面代码的执行。

js 是一门单线程语言，如果代码都是同步执行就有可能造成阻塞，如果使用异步则不会阻塞主线程。

## 回调函数

1. 定时器
2. 事件监听
3. ajax 网络请求

## Promise

### 1. then()

当Promise执行的内容符合成功条件时，调用resolve函数，失败就调用reject函数。那Promise创建完了，该如何调用呢？这时就该then出场了：

```javascript
promise.then(
  function (value) {
    // success
  },
  function (error) {
    // failure
  },
);
```

then方法接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。其中第二个参数可以省略。

then方法返回的是一个新的Promise实例。因此可以采用链式写法，即then方法后面再调用另一个then方法。当写有顺序的异步事件时，需要串行时，可以这样写：

```javascript
let promise = new Promise((resolve, reject) => {
  ajax("first").success(function (res) {
    resolve(res);
  });
});
promise
  .then((res) => {
    return new Promise((resolve, reject) => {
      ajax("second").success(function (res) {
        resolve(res);
      });
    });
  })
  .then((res) => {
    return new Promise((resolve, reject) => {
      ajax("second").success(function (res) {
        resolve(res);
      });
    });
  })
  .then((res) => {});
```

### 2. catch()

Promise对象的catch方法相当于then方法的第二个参数，指向reject的回调函数。

不过catch方法还有一个作用，就是在执行resolve回调函数时，如果出现错误，抛出异常，不会停止运行，而是进入catch方法中

### 3. all()

1. 全部执行
2. 有一个失败就失败 返回失败的promise 全部成功才成功 返回成功数组
   all方法可以完成并行任务， 它接收一个数组，数组的每一项都是一个promise对象。当数组中所有的promise的状态都达到resolved时，all方法的状态就会变成resolved，如果有一个状态变成了rejected，那么all方法的状态就会变成rejected：

### 4. race()

1. 谁先执行完谁就返回谁
2. 有一个失败就失败 返回失败的promise
3. 有一个成功就成功 返回成功的promise

race方法和all一样，接受的参数是一个每项都是promise的数组，但与all不同的是，当最先执行完的事件执行完之后，就直接返回该promise对象的值

常见场景 ： 要执行一个任务，这个任务超过多久就不执行了

### 5. finally()

finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

### 6. allSettled()

1. 全部执行
2. 不管成功失败都返回成功数组 ，每个元素都是一个对象，包含状态和值

Promise.allSettled 的语法及参数跟 Promise.all 类似，其参数接受一个 Promise 的数组，返回一个新的 Promise。唯一的不同在于，执行完之后不会失败，也就是说当 Promise.allSettled 全部处理完成后，我们可以拿到每个 Promise 的状态，而不管其是否处理成功。

### 7. any()

1. 全部执行
2. 有一个成功就成功 返回成功的promise
3. 所有都失败才返回失败的promise

any 方法返回一个 Promise，只要参数 Promise 实例有一个变成 fullfilled 状态，最后 any 返回的实例就会变成 fullfilled 状态；如果所有参数 Promise 实例都变成 rejected 状态，包装实例就会变成 rejected 状态。

### 手写promise

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  #state = PENDING;
  #result = void 0;
  #handler = [];
  constructor(executor) {
    const resolve = (value) => {
      this.#changeState(FULFILLED, value);
    };

    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  #isPromise(value) {
    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function")
    ) {
      return typeof value.then === "function";
    }
    return false;
  }
  #changeState(state, result) {
    if (this.#state !== PENDING) return;
    this.#state = state;
    this.#result = result;
    this.#run();
  }

  #runMicroTask(func) {
    if (typeof process === "object" && typeof process.nextTick === "function") {
      process.nextTick(func);
    } else if (typeof MutationObserver === "function") {
      const ob = new MutationObserver(func);
      const textNode = document.createTextNode("");
      ob.observe(textNode, { characterData: true });
      textNode.textContent = "1";
      ob.disconnect();
    } else {
      setTimeout(func, 0);
    }
  }

  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback !== "function") {
        const settled = this.#state === FULFILLED ? resolve : reject;
        settled(this.#result);
        return;
      }
      try {
        const data = callback(this.#result);
        if (this.#isPromise(data)) {
          data.then(resolve, reject);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  #run() {
    if (this.#state === PENDING) return;
    while (this.#handler.length) {
      const handler = this.#handler.shift();
      if (this.#state === FULFILLED) {
        this.#runOne(handler.onFulfilled, handler.resolve, handler.reject);
      } else {
        this.#runOne(handler.onRejected, handler.resolve, handler.reject);
      }
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handler.push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
      this.#run();
    });
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}
```

## Generator

Generator（生成器）是 ES6 中的关键词，通俗来讲 Generator 是一个带星号的函数（它并不是真正的函数），可以配合 yield 关键字来暂停或者执行函数。先来看一个例子

```js
function* gen() {
  console.log("enter");
  let a = yield 1;
  let b = yield (function () {
    return 2;
  })();
  return 3;
}
var g = gen(); // 阻塞，不会执行任何语句
console.log(typeof g); // 返回 object 这里不是 "function"
console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());

// 结果
// object
// enter
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: true }
// { value: undefined, done: true }
```
