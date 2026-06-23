---
icon: vscode-icons:file-type-light-db
date: 2023-11-13
order: 1
category:
  - JavaScript
---

# 前端存储

**前端存储的作用**

1. 方面网页的加载，避免了在发送请求收到响应前页面的空白期
2. 可以在非强制实时更新时减少向服务端的请求
3. 在网络不佳或者无网络的情况下可以离网查看

**五种前端存储的方案**

1. localStorage
2. sessionStorage
3. cookie
4. indexDB
5. webSQL

**对比**

| 特性             | cookie                                     | localStorage             | sessionStorage | indexDB                  | Web SQL                  |
| :--------------- | :----------------------------------------- | :----------------------- | :------------- | :----------------------- | :----------------------- |
| **数据生命周期** | 一般由服务器生成，可以设置过期时间         | 除非被清理，否则一直存在 | 页面关闭就清理 | 除非被清理，否则一直存在 | 除非被清理，否则一直存在 |
| **数据存储大小** | 4K                                         | 5M                       | 5M             | 未限制                   | 未限制                   |
| **与服务端通信** | 每次都会携带在 header 中，对于请求性能影响 | 不参与                   | 不参与         | 不参与                   | 不参与                   |

## Cookie

### 生命周期

- 如果设定了 Cookie 的过期时间，那么 Cookie 会在到期时自动失效
- 如果没有设定过期时间，那么 Cookie 就是 session 级别的，即浏览器关闭时 Cookie 自动消失

### 存储大小 4KB

### 优缺点

**优点**

- 可以控制过期时间
- 可以跨域共享
- 可以加密安全传输
- 有较高的兼容性

**缺点**

- 最多只能存储 4KB 数据
- 存储数量存在限制
- 请求头上的数据容易被拦截和攻击
- 存储的数据只能是字符串

```js
// 设置 Cookie
// Cookie 值必须是字符串类型，并且不支持分号、逗号以及空格，
// 所以有时需要先使用 encodeURIComponent() 进行编码，或者使用 JSON.stringify() 进行序列化
document.cookie = "键1=值1;键2=值2;键n=值n";

// 读取 Cookie
// 有时需要使用 decodeURIComponent() 或者 JSON.parse()
document.cookie;

// 修改 Cookie
// 如果键不存在，就新增；否则就修改
document.cookie = "已经存储过的键=新值";

// 删除 Cookie
document.cookie = "要删除的键=任意值;max-age=0";
```

### 常见的场景

- 身份认证 / 会话管理
  `Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Lax`
  - 用户登录后，服务器下发一个 session token 存于 Cookie
  - 后续每次请求自动携带，服务端无需前端手动添加
  - 关键：配合 HttpOnly 标记，JS 完全无法读取，防止 XSS 窃取 token
- 跨子域共享状态
  `Set-Cookie: user_theme=dark; Domain=example.com`

- 服务端渲染（SSR）中的状态传递
  - Next.js、Nuxt 等框架的服务端 getServerSideProps 可以直接读取 Cookie

**最佳实践**

```js
Set-Cookie: session=xxx;
  HttpOnly;           // JS 不可读，防 XSS
  Secure;             // 仅 HTTPS 传输
  SameSite=Lax;       // 防 CSRF（允许顶级导航携带）
  Path=/;
  Max-Age=86400       // 明确过期时间，而非 Expires
```

| 属性       | 作用          | 推荐值                               |
| ---------- | ------------- | ------------------------------------ |
| `HttpOnly` | 禁止 JS 访问  | ✅ 敏感数据必设                      |
| `Secure`   | 仅 HTTPS 发送 | ✅ 生产环境必设                      |
| `SameSite` | 跨站请求控制  | `Lax`（最常用）或 `Strict`（最严格） |
| `Max-Age`  | 相对过期时间  | 明确设置，避免使用 `Expires`         |

## webStorage(LocalStorage | SessionStorage)

**优势**

- 不会主动携带发送给客户端
- 能够存储更大的内容

### 生命周期

- localStorage 是永久存储，除非手动删除
- sessionStorage 是会话存储，页面关闭后自动删除

### 存储大小 5MB

### 优缺点

**优点**

- 存储空间大
- 不会被网络截取

**缺点**

- 只能存字符串类型

## IndexDB

IndexedDB 是浏览器提供的本地数据库，是 HTML5 新加的，允许存储大量数据，提供查找接口，还能建立索引。这些都是 WebStorage 不具备的。就数据库而言，IndexedDB 不属于关系型数据库（不支持 SQL 查询语句），接近于 NoSQL 数据库，以键值对的形式进行存储，可以快速进行读取操作，非常适合 Web 场景，同时使用 JS 进行操作会很方便。

- 在浏览器中存储大量结构化数据，并支持高性能检索

### 容量（磁盘60%）

```javascript
const estimate = await navigator.storage.estimate();
console.log(estimate.quota); // 总配额（字节）
console.log(estimate.usage); // 已使用（字节）
console.log(estimate.usageDetails); // 各存储类型的详细用量
```

### 优缺点

**优点**

- 存储空间大
- 不会被网络截取
- 支持索引
- 支持事务

**缺点**

- 不支持 SQL 查询语句
- 不支持关系型数据库
- 不支持多线程访问
- IndexedDB 不支持实时监听跨标签变化

### 应用场景

- 离线优先应用 比如离线的时候把数据缓存下来， 再连网的时候批量更新 （离线文档）
- 内容很大 >10M
- 需要按照字段查询
- 存储二进制数据

### 相关库

- idb 	对原生 API 的 Promise 封装，轻量级，易用
- Dexie.js 最流行的封装，类 MongoDB 查询语法
- localForage 类 localStorage API，自动降级

## WebSQL（已废弃）

WebSQL 是在浏览器端运行的轻量级数据库，WebSQL 类似于 SQLite，更像是关系型数据库，使用 SQL 查询数据。注意，这种本地数据存储方案已经被废弃。

<!-- ## 常见的问题

1. LocalStorage/SessionStorage 区别
2. Cookie 和 webStorage的区别 cookie 的常见属性
3. IndexDB 常见场景？
4. 如何保障前端存储的安全性？在存储敏感数据时，应该注意哪些问题？
5. 为什么不推荐在 LocalStorage 中存储敏感信息（如 JWT）？如何避免 CSRF 和 XSS 攻击导致的安全隐患？
  1. localStorage 可以被js读取 遭遇xss攻击 token 会被窃取
  2. 使用cookie + httponly + sameSite 可以避免xss攻击和csrf攻击 -->
