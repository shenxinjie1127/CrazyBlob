---
icon: akar-icons:file
date: 2025-08-21
order: 7
category:
  - Utils
---

# EventBus 事件总线

## 概述

EventBus 是一个观察者模式的实现，用于组件之间的解耦通信。在 Vue 项目中，兄弟组件或跨层级组件之间的通信往往比较麻烦，EventBus 提供了一种简单而强大的解决方案，允许组件之间通过事件进行松耦合的通信。

### 核心概念

- **发布-订阅模式（Publish-Subscribe Pattern）**：发布者发布事件，订阅者订阅事件，事件总线负责两者之间的协调
- **事件监听（$on）**：注册事件监听器，当事件触发时执行回调
- **事件触发（$emit）**：触发指定事件，通知所有订阅者
- **事件卸载（$off）**：移除事件监听器
- **单次监听（$once）**：只执行一次的监听器，执行后自动销毁

### 设计优势

1. **松耦合**：发布者和订阅者不需要直接引用对方，降低组件间的耦合度
2. **跨组件通信**：轻松实现兄弟组件、跨层级组件之间的通信
3. **类型安全**：完整的 TypeScript 类型定义，提供良好的开发体验
4. **灵活管理**：支持通过事件名或事件 ID 移除监听，支持批量移除

---

## 类型定义

### EventType 事件类型

```typescript
interface EventType {
  id: number; // 唯一标识符，用于精确移除单个监听
  eventName: string; // 事件名称
  eventFnc: EventFnc; // 事件回调函数
  once: boolean; // 是否只执行一次
}
```

| 属性      | 类型     | 说明                                                 |
| --------- | -------- | ---------------------------------------------------- |
| id        | number   | 事件唯一标识，通过 UUID 生成，用于精确移除特定监听器 |
| eventName | string   | 事件名称，订阅和发布时使用                           |
| eventFnc  | EventFnc | 事件触发时执行的回调函数                             |
| once      | boolean  | 标记是否为单次监听，true 时执行后自动移除            |

### EventFnc 事件回调

```typescript
interface EventFnc {
  (...args: any): void;
}
```

事件回调函数类型，接受任意数量的参数，返回 void。

### EventBusOption 配置选项

```typescript
export interface EventBusOption {
  immediate?: boolean; // 是否立即执行一次
  once?: boolean; // 是否只执行一次
}
```

| 属性      | 类型    | 默认值 | 说明                                   |
| --------- | ------- | ------ | -------------------------------------- |
| immediate | boolean | false  | 设置为 true 时，注册后立即执行一次回调 |
| once      | boolean | false  | 设置为 true 时，回调执行一次后自动销毁 |

### EventBusProps 接口定义

```typescript
export interface EventBusProps {
  $on(eventName: string, callback: EventFnc, option?: EventBusOption): number;
  $emit(eventName: string, ...args: any): Promise<void | void[]>;
  $off(eventName?: string | number | Array<string> | Array<number>): void;
  $once(eventName: string, callback: EventFnc): void;
}
```

| 方法  | 参数                                                 | 返回值          | 说明                         |
| ----- | ---------------------------------------------------- | --------------- | ---------------------------- |
| $on   | eventName: 事件名, callback: 回调函数, option?: 配置 | number (事件ID) | 注册事件监听，返回事件ID     |
| $emit | eventName: 事件名, ...args: 传递给回调的参数         | Promise         | 触发事件，执行所有订阅的回调 |
| $off  | eventName?: 事件名或ID或数组                         | void            | 移除事件监听，支持多种方式   |
| $once | eventName: 事件名, callback: 回调函数                | void            | 注册单次监听，执行后自动销毁 |

---

## 核心实现

```typescript
import {createUUID} from '@utils'

export default class EventBus implements EventBusProps {
    private _eventList: Array<EventType> = []
```

### 事件存储结构

EventBus 内部维护一个 `_eventList` 数组，用于存储所有注册的事件监听器。每个监听器包含唯一 ID、事件名称、回调函数和单次执行标记。

---

## 方法详解

### $on 注册监听

```typescript
public $on(eventName: string, callback: EventFnc, option?: EventBusOption): number {
    const events: Array<EventType> = this._findEvent(eventName)

    const event: UndefinedAble<EventType> = events?.find((event: EventType) => {
        return event.eventFnc === callback && event.eventName === eventName
    })

    let resultId
    if (!event) {
        resultId = this._addEvent(eventName, callback)
    } else {
        resultId = event.id
    }

    option?.immediate && callback('')
    return resultId
}
```

**执行流程**：

1. 根据事件名查找已存在的监听器列表
2. 检查相同事件名和相同回调引用的监听器是否已存在（防止重复注册）
3. 如果不存在，则添加新的事件监听
4. 如果已存在，返回现有事件的 ID
5. 如果配置了 `immediate`，立即执行一次回调
6. 返回事件 ID 用于后续移除

### $emit 触发事件

```typescript
public $emit(eventName: string, ...args: any): Promise<void | void[]> {
    const events: Array<EventType> = this._findEvent(eventName)

    if (events.length) {
        return Promise.all(
            events.map((eventType: EventType) => {
                eventType.eventFnc(...args)
                eventType.once && this.$off(eventType.id)
            })
        )
    }
    return Promise.resolve()
}
```

**执行流程**：

1. 根据事件名查找所有已注册的监听器
2. 使用 Promise.all 并行执行所有回调函数
3. 传递所有参数给回调函数
4. 对于标记为 `once` 的监听器，执行后自动移除
5. 返回 Promise 数组结果

### $off 移除监听

```typescript
public $off(eventName?: string | number | Array<string> | Array<number>): void {
    if (typeof eventName === 'string') {
        this._eventList = this._eventList.filter(event => event.eventName !== eventName)
    } else if (typeof eventName === 'number') {
        const index: number = this._eventList.findIndex((event: EventType) => event.id === eventName)
        if (index > -1) this._eventList.splice(index, 1)
    } else if (eventName instanceof Array) {
        eventName.map(m => this.$off(m))
    } else {
        this._eventList = []
    }
}
```

**参数类型**：

- string：移除该事件名的所有监听器
- number：根据事件 ID 移除特定监听器
- Array<string | number>：批量移除多个事件名或事件 ID
- undefined：不传参数清空所有监听器

### $once 单次监听

```typescript
public $once(eventName: string, callback: EventFnc): void {
    this.$on(eventName, callback, {once: true})
}
```

内部调用 `$on` 方法，传入 `{once: true}` 配置，执行后自动销毁。

---

## 内部方法

### \_findEvent 查找事件

```typescript
private _findEvent(eventName: string): Array<EventType> {
    return this._eventList.filter((event: EventType) => event.eventName === eventName)
}
```

根据事件名筛选出所有匹配的监听器。

### \_addEvent 添加事件

```typescript
private _addEvent(eventName: string, callback: EventFnc, once = false): number {
    const id = createUUID()
    this._eventList.push({
        id,
        eventName,
        eventFnc: callback,
        once
    })
    return id
}
```

创建新的事件监听器，生成唯一 ID，加入事件列表。

---

## 使用示例

### 基础用法

```typescript
import EventBus from "@/utils/EventBus";

const eventBus = new EventBus();

// 订阅事件
const eventId = eventBus.$on("userLogin", (userInfo) => {
  console.log("用户登录:", userInfo);
});

// 触发事件
eventBus.$emit("userLogin", { name: "张三", age: 25 });

// 移除特定监听
eventBus.$off(eventId);

// 移除所有 userLogin 事件监听
eventBus.$off("userLogin");

// 清空所有监听
eventBus.$off();
```

### 单次监听

```typescript
// 只执行一次的监听
eventBus.$once("initComplete", (data) => {
  console.log("初始化完成:", data);
});

// 触发后自动移除，无需手动清理
eventBus.$emit("initComplete", { status: "success" });
```

### 立即执行

```typescript
// 注册后立即执行一次
eventBus.$on(
  "counter",
  (value) => {
    console.log("计数:", value);
  },
  { immediate: true },
);

// 后续触发
eventBus.$emit("counter", 1); // 输出: 计数: 1
eventBus.$emit("counter", 2); // 输出: 计数: 2
```

### 传递多个参数

```typescript
eventBus.$on("userUpdate", (name, age, address) => {
  console.log(`更新用户: ${name}, ${age}岁, 住在${address}`);
});

eventBus.$emit("userUpdate", "李四", 30, "北京");
// 输出: 更新用户: 李四, 30岁, 住在北京
```

---

## 使用场景

### 兄弟组件通信

```typescript
// Parent.vue - 创建 EventBus 实例
const eventBus = new EventBus();
provide("eventBus", eventBus);

// ChildA.vue - 发布事件
const eventBus = inject("eventBus") as EventBus;
const sendMessage = () => {
  eventBus.$emit("message", "Hello from ChildA");
};

// ChildB.vue - 订阅事件
const eventBus = inject("eventBus") as EventBus;
onMounted(() => {
  eventBus.$on("message", (msg: string) => {
    console.log("收到消息:", msg);
  });
});
```

### 跨层级通信

```typescript
// 在路由切换时通知特定组件
// RouterChangeNotifier.vue
eventBus.$emit("routeChange", { path: "/home", query: {} });

// Header.vue (多层嵌套)
eventBus.$on("routeChange", (data) => {
  this.currentPath = data.path;
});
```

### 状态同步

```typescript
// 用户登录状态同步
// Login.vue
eventBus.$emit("loginStateChange", { isLoggedIn: true, user: userInfo });

// UserAvatar.vue
eventBus.$on("loginStateChange", ({ isLoggedIn, user }) => {
  this.showLoginButton = !isLoggedIn;
  this.userInfo = user;
});

// Header.vue
eventBus.$on("loginStateChange", ({ isLoggedIn }) => {
  this.updateAuthUI(isLoggedIn);
});
```

---

## 注意事项

### 1. 内存泄漏风险

```typescript
// 组件销毁时务必移除监听
import { onUnmounted } from "vue";

onUnmounted(() => {
  eventBus.$off("yourEvent");
});
```

### 2. 避免重复订阅

```typescript
// 每次组件挂载都会添加新的监听
onMounted(() => {
    eventBus.$on('event', handler)  // 危险：可能重复
})

// 建议：使用 ID 移除或确保只订阅一次
const handler = (data) => {...}
onMounted(() => {
    if (!this.hasSubscribed) {
        eventBus.$on('event', handler)
        this.hasSubscribed = true
    }
})
onUnmounted(() => {
    eventBus.$off(handler)
})
```

### 3. 调试技巧

```typescript
// 查看当前所有事件订阅
console.log(eventBus._eventList);

// 事件追踪
const originalEmit = eventBus.$emit;
eventBus.$emit = function (eventName, ...args) {
  console.log(`[EVENT] ${eventName}`, ...args);
  return originalEmit.apply(this, [eventName, ...args]);
};
```

### 4. 与 Vue 3 组合式 API 配合

```typescript
// 提供全局 EventBus
import { provide, inject } from "vue";

// main.ts
const eventBus = new EventBus();
app.provide("eventBus", eventBus);

// 组件中使用
const eventBus = inject("eventBus") as EventBus;
```

---

## 对比 Vue 3 新的方案

Vue 3 推荐使用 `mitt` 库或 Vue 自身的 `mitt` 插件机制：

```typescript
import mitt from "mitt";

const emitter = mitt();

// 订阅
emitter.on("foo", (e) => console.log("foo", e));

// 触发
emitter.emit("foo", { a: "b" });

// 移除
emitter.off("foo");
```

**mitt vs EventBus 对比**：

| 特性       | EventBus (当前实现) | mitt              |
| ---------- | ------------------- | ----------------- |
| 体积       | 较大 (完整类实现)   | 极小 (~200 bytes) |
| TypeScript | 完整支持            | 完整支持          |
| 事件 ID    | 支持                | 不支持            |
| 批量移除   | 支持                | 需手动            |
| 立即执行   | 支持                | 不支持            |

---

## 完整 API 参考

```typescript
const bus = new EventBus();

// 注册监听
const id = bus.$on(
  "eventName",
  (arg1, arg2) => {
    // 处理逻辑
  },
  { immediate: false, once: false },
);

// 触发事件
await bus.$emit("eventName", arg1, arg2);

// 移除单个
bus.$off(id);

// 移除多个
bus.$off(["event1", "event2"]);

// 移除全部
bus.$off();

// 单次监听
bus.$once("singleEvent", (data) => {
  console.log(data);
});
```
