---
icon: akar-icons:file
date: 2026-05-27
order: 1
category:
  - HTTP
---

# HTTP

## HTTP 方法

| 方法    | 是否安全 | 说明                                                                    |
| ------- | -------- | ----------------------------------------------------------------------- |
| GET     | 安全     | 获取资源。请求参数妨碍URL 上，不会对资源产生副作用                      |
| POST    | 不安全   | 提交数据（如表单、上传），可能导致资源变化或创建。                      |
| PUT     | 不安全   | 用于整体更新某个资源                                                    |
| PATCH   | 不安全   | 用于部分更新资源                                                        |
| DELETE  | 不安全   | 删除指定资源                                                            |
| HEAD    |          | 类似GET，但不返回响应体，只返回响应头。常用于资源是否存在，获取响应信息 |
| OPTIONS |          | 用于客户端获取服务器支持哪些方法，也是CORS 预检请求的一部分             |
| TRACE   | 不安全   | 回显服务器收到的请求，主要用于调试。                                    |
| CONNECT |          | 用于建立代理服务器与目标服务器的隧道，常用于代理服务器。                |

## HTTP 状态码

### 1xx — 信息响应

| 状态码 | 名称 | 说明 |
|--------|------|------|
| 100 | Continue | 继续，客户端应继续发送请求 |
| 101 | Switching Protocols | 切换协议，如升级到 WebSocket |
| 103 | Early Hints | 预加载提示，用于优化性能 |

### 2xx — 成功

| 状态码 | 名称 | 说明 |
|--------|------|------|
| **200** | OK | 请求成功（GET/POST 通用） |
| **201** | Created | 已创建新资源（常用于 POST） |
| 202 | Accepted | 已接受请求，但尚未处理完 |
| 204 | No Content | 请求成功但无返回内容（常用于 DELETE） |
| 206 | Partial Content | 部分内容（断点续传、分块下载） |

### 3xx — 重定向

| 状态码 | 名称 | 说明 |
|--------|------|------|
| **301** | Moved Permanently | 永久重定向（URL 已永久变更） |
| **302** | Found | 临时重定向（之前叫 Moved Temporarily） |
| **304** | Not Modified | 内容未修改（缓存有效，省带宽） |
| 307 | Temporary Redirect | 临时重定向（保持请求方法不变） |
| 308 | Permanent Redirect | 永久重定向（保持请求方法不变） |

### 4xx — 客户端错误

| 状态码 | 名称 | 说明 |
|--------|------|------|
| **400** | Bad Request | 请求语法错误，服务器无法理解 |
| **401** | Unauthorized | 未认证，需要身份验证 |
| **403** | Forbidden | 已认证但无权限访问 |
| **404** | Not Found | 资源不存在 |
| 405 | Method Not Allowed | 请求方法不被允许（如对 GET 接口用 POST） |
| 408 | Request Timeout | 请求超时 |
| 409 | Conflict | 资源冲突（如重复创建） |
| **429** | Too Many Requests | 请求频率过高，被限流 |
| 451 | Unavailable For Legal Reasons | 因法律原因不可用 |

### 5xx — 服务器错误

| 状态码 | 名称 | 说明 |
|--------|------|------|
| **500** | Internal Server Error | 服务器内部错误（万能兜底码） |
| **502** | Bad Gateway | 网关错误（上游服务异常） |
| **503** | Service Unavailable | 服务暂时不可用（维护 / 过载） |
| **504** | Gateway Timeout | 网关超时（上游服务响应过慢） |

---


### 常见状态码
- 200 OK  请求成功
- 201 Created 资源创建成功
- 301 Moved Permanently 永久重定向
- 302 Found 临时重定向
- 304 Not Modified 内容未修改
- 400 Bad Request 请求语法错误，服务器无法理解
- 401 Unauthorized 未认证，需要身份验证
- 403 Forbidden 已认证但无权限访问
- 404 Not Found 资源不存在
- 405 Method Not Allowed 请求方法不被允许（如对 GET 接口用 POST）
- 408 Request Timeout 请求超时
- 409 Conflict 资源冲突（如重复创建）
- 429 Too Many Requests 请求频率过高，被限流
- 451 Unavailable For Legal Reasons 因法律原因不可用
- 500 Internal Server Error 服务器内部错误（万能兜底码）
- 502 Bad Gateway   网关错误（上游服务异常）
- 503 Service Unavailable 服务暂时不可用（维护 / 过载）
- 504 Gateway Timeout 网关超时（上游服务响应过慢）
