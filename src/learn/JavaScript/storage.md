---
icon: vscode-icons:file-type-light-db
date: 2023-11-13
order: 1
category:
  - JavaScript
---

# 前端存储

## indexedDB

对于本地话存储 我们一般都会想到cookie webStorage（sessionStorage、localStorage）对于这些存储方式，存在以下比较明显的缺点

1. 存储量小 web storage 的存储量最大也只有5M。
2. 存取不方便 存入的内容会经过序列化 取值的时候需要经过反序列化。

indexedDB 是一种底层的API，用于在客户端存储大量的结构化数据（包括文件和二进制对象）

- indexedDB
  是一个基于JavaScript的面向对象数据库，允许你存储和检索用键索引的对象可以存储结构化克隆算法支持的任何对象[Array ArrayBuffer Boolean DataView Date Error Map Object RegExp Set String TypedArray]
  Error 仅支持部分
- 存取方便 不需要序列化
- 异步存取
- 庞大的存储量

#### 使用

```javascript
localforage.getItem('somekey').then(function (value) {
    // 当离线仓库中的值被载入时，此处代码运行
    console.log(value);
}).catch(function (err) {
    // 当出错时，此处代码运行
    console.log(err);
});
// 不同于 localStorage，你可以存储非字符串类型
localforage.setItem('my array', [1, 2, 'three']).then(function (value) {
    // 如下输出 `1`
    console.log(value[0]);
}).catch(function (err) {
    // 当出错时，此处代码运行
    console.log(err);
});
localforage.removeItem('somekey').then(function () {
    // 当值被移除后，此处代码运行
    console.log('Key is cleared!');
}).catch(function (err) {
    // 当出错时，此处代码运行
    console.log(err);
});
localforage.clear().then(function () {
    // 当数据库被全部删除后，此处代码运行
    console.log('Database is now empty.');
}).catch(function (err) {
    // 当出错时，此处代码运行
    console.log(err);
});
var store = localforage.createInstance({
    name: "nameHere"
});

var otherStore = localforage.createInstance({
    name: "otherName"
});

// 设置某个数据仓库 key 的值不会影响到另一个数据仓库
store.setItem("key", "value");
otherStore.setItem("key", "value2");
```

### 手写防抖和节流

```javascript
// 节流
function throttle(func, delay) {
    let lastExecTime = 0;
    let timeoutId;

    return function (...args) {
        const currentTime = Date.now();

        if (currentTime - lastExecTime < delay) {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                lastExecTime = currentTime;
                func.apply(this, args);
            }, delay);
        } else {
            lastExecTime = currentTime;
            func.apply(this, args);
        }
    };
}

// 防抖
function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
```
