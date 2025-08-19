---
icon: akar-icons:file
date: 2024-12-21
order: 6
category:
  - JavaScript
---

# Worker

## Web Worker

Web Worker 是一种运行在主线程之外的 JavaScript 并行执行环境。通过 Web Worker，开发者可以将耗时的任务（如数据处理、文件解析等）从主线程中剥离，从而提高页面的响应速度和用户体验。

### API

#### 创建Worker

::: important Frontmatter
参数是包含 Worker 脚本的文件路径。需要注意的是，文件必须与主线程在同源下运行。
:::

```javascript :no-line-numbers
const worker = new Worker("worker.js");
```

#### 发送消息到Worker

主线程使用`postMessage` 方法向 Worker 发送消息。

```javascript :no-line-numbers
worker.postMessage({type: "start", data: "Hello Worker!"});
```

::: tip
发送的数据可以是任何可序列化的对象，例如字符串、数字、数组或 JSON 对象。
:::

#### Worker 接收消息

Worker 使用 onmessage 事件监听消息。

```javascript :no-line-numbers
self.onmessage = function (event) {
    console.log('Message from Main Thread:', event.data);
};
```

#### Worker 发送消息到主线程

Worker 使用 `postMessage` 方法将消息发送回主线程。

```javascript :no-line-numbers
self.postMessage({type: "response", data: "Hello Main Thread!"});
```

#### 捕获错误

主线程可以通过 `onerror` 捕获 `Worker` 抛出的错误。

```javascript :no-line-numbers
worker.onerror = function (error) {
    console.error('Worker error:', error.message);
};
```

#### 终止Worker

主线程可以使用 `terminate` 方法终止 Worker。

```javascript :no-line-numbers
worker.terminate();
```

#### Worker 内部全局对象

在 Worker 内部，全局对象是 `self`，与主线程中的 `window` 不同。常用的方法包括：

### 示例

**主线程**

```javascript :no-line-numbers
const worker = new Worker('worker.js');

worker.postMessage("我是主线程");

worker.onmessage = function (event) {
    console.log('worker 回复:', event.data);
};

worker.onerror = function (error) {
    console.error('Worker 错误:', error.message);
};
```

**Worker 线程（worker.js）**

```javascript :no-line-numbers
self.onmessage = function (event) {
    console.log('主线程发送:', event.data);
    self.postMessage("我是 Worker 线程");
};
```

### 使用场景

- 大量复杂计算任务
- 数据处理和解析
- 文件上传和下载

## Shared Worker

是一种特殊类型的 Web Worker，它允许在多个浏览上下文（如多个窗口、iframe 或其他 worker）之间共享一个 Worker。与普通 Worker 不同，SharedWorker 具有独立的全局作用域，即 SharedWorkerGlobalScope

### 特点

- **跨页面通信**：SharedWorker 可以在多个页面或 `iframe` 中运行，从而实现跨页面的通信。这对于需要在多个页面之间共享数据或状态的应用场景非常有用
- **独立于页面的生命周期**：SharedWorker 的生命周期独立于页面，这意味着即使关闭了创建 `SharedWorker` 的页面，`SharedWorker` 仍然可以继续运行，直到所有相关页面都关闭
- **同源策略**：要使 SharedWorker 连接到多个不同的页面，这些页面必须是同源的（相同的协议、主机和端口）

### API

#### 创建Worker

```javascript :no-line-numbers
const worker = new SharedWorker("worker.js");
```

通信方式同Web Worker。

### 使用场景

- 跨页面登录
- 多页面通信

## Service Worker

Service Worker 首先是一个运行在后台的 Worker 线程，然后它会长期运行，充当一个服务，很适合那些不需要网页或用户互动的功能。它的最常见用途就是拦截和处理网络请求。

Service Worker 是一个后台运行的脚本，充当一个代理服务器，拦截用户发出的网络请求，比如加载脚本和图片。Service Worker 可以修改用户的请求，或者直接向用户发出回应，不用联系服务器，这使得用户可以在离线情况下使用网络应用。它还可以在本地缓存资源文件，直接从缓存加载文件，因此可以加快访问速度。

### 注册Service Worker

```javascript :no-line-numbers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

```

### 示例

```javascript :no-line-numbers
self.addEventListener('fetch', (event) => {
    event.waitUntil(() => {
        if (event.request.url.includes('/product')) {
            let productId = event.data.productId
            let productCount = getProductData(productId)
            indexedDB.open('store', 1, (db) => {
                let productStore = db.createObjectStore('products', {keyPath: 'id'})
                productStore.put({id: productId, count: ++productCount})
            })
        }
    })
})

```

### 使用步骤

#### 注册

```javascript :no-line-numbers

navigator.serviceWorker.register('sw.js').then(() => {
    console.info('注册成功')
}).catch((err) => {
    console.error('注册失败')
});
```
