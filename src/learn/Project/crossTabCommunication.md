---
icon: akar-icons:file
date: 2026-06-05
order: 13
category:
  - Utils
---

# 跨标签页通信


### Broadcast Channel API（收音机）

这是 HTML5 提供的专用广播通信机制，一对多，同源下所有标签页共享一个频道，用法类似“收音机”。

- 专为通信设计，性能好，没有大小限制
- 不支持IE 有同源限制

```javascript
// 创建或连接频道（名称一致即可）
const channel = new BroadcastChannel('order_channel');

// 页面A：发送消息
channel.postMessage({ type: 'UPDATE', data: '新订单' });

// 页面B：监听消息
channel.onmessage = (event) => {
  console.log('收到:', event.data); // { type: 'UPDATE', data: '新订单' }
};

// 页面关闭前断开（可选）
channel.close();
```

### localStorage + storage 事件（兼容性最好，经典方案)
利用同源下，一个标签页修改 localStorage 会触发其他标签页的 storage 事件。注意：触发事件的是“其他标签页”，修改数据的当前页面不会触发自身。

- 数据需要序列化为字符串；操作会写入磁盘（相比 BroadcastChannel 稍慢）；事件仅在值改变时触发（新旧值相同则不触发）
```javascript
// 页面A：发送数据
localStorage.setItem('message', JSON.stringify({ text: 'Hello' }));

// 页面B：监听变化
window.addEventListener('storage', (e) => {
  if (e.key === 'message') {
    const data = JSON.parse(e.newValue);
    console.log('收到:', data); // { text: 'Hello' }
    // 重要：读取后建议清除，避免下次重复触发
    localStorage.removeItem('message');
  }
});
```

### window.open + window.postMessage

适用于A 页面通过 window.open 打开 B 页面，或通过 iframe 嵌入的场景，支持跨域通信

- 支持跨域
- 需要防止xss


```javascript
// ============ 页面A（父窗口） ============
const childWindow = window.open('https://example.com/pageB');
// 等待加载完成后发送消息
childWindow.onload = () => {
  childWindow.postMessage('来自父页面的数据', 'https://example.com'); // 指定目标源
};

// ============ 页面B（子窗口） ============
window.addEventListener('message', (e) => {
  // 安全校验：验证来源
  if (e.origin === 'https://parent.com') {
    console.log('父页面发来:', e.data);
    // 回复父页面
    e.source.postMessage('收到回复', e.origin);
  }
});
```


### SharedWorker(共享线程)
启动一个独立的共享线程，所有同源标签页都可以连接它，通过它转发消息。适合需要持久化状态或集中管理数据的复杂场景

- 进程级别持久化，多个标签页共享内存，适合大容量数据传输。
- 调试比较麻烦

```javascript
// ============ worker.js ============
const ports = [];
onconnect = (e) => {
  const port = e.ports[0];
  ports.push(port);
  port.onmessage = (msg) => {
    // 广播给所有连接的端口
    ports.forEach(p => p.postMessage(msg.data));
  };
};

// ============ 页面 main.js ============
const worker = new SharedWorker('worker.js');
worker.port.onmessage = (e) => console.log('收到:', e.data);
// 发送消息
worker.port.postMessage('Hello');
```