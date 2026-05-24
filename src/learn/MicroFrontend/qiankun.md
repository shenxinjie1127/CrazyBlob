---
icon: akar-icons:file
date: 2026-04-27
order: 2
category:
  - Micro Fontends
---

# qiankun

## 入口配置 (主应用)

- name 子应用名称
- activeRule 显示某个子应用对应的路由规则
- container 该子路由挂载的目标容器
- entry 子应用的在线页面地址或者js 和 css地址


```javascript
registerMicroApps([
    {
        name: "app1",
        activeRule: "/app1",
        container: "#son",
        entry: {
            sctipt: ["//localhost:3000/app1/xxx.umd.js"], // 对应资源
            styles: [],
            html: `<div id="son"></div>`
        },
        props: {
            activeRule: 'app1'
        }
    },
    {
        name: "app2",
        activeRule: "/app2",
        container: "#son",
        entry: "//localhost:3000" // 对应线上地址
    }
])
```

## 主应用挂载完成后，start 方法要在主应用的mount阶段执行


## 子应用需要做的事情

1. 暴露对应的声明周期方法 （mount unmount）
2. 调整打包模式为umd 打包
3. 子应用需要为自己开启一个独立站点 或者把js、css放在服务器上


```javascript
export function mount() {
    
}

export function unmount() {
    
}
```

## 遇到的一些问题

### 渲染不出来的问题

1. 首先 主应用中会填写一个容器，用来放置子应用 ，而 子应用中也会有一个目标容器去渲染
2. 当我们使用js和css 的方案加载子应用的时候，我们最好在主应用中只放置一个主应用容器（比如 #container）然后用html去定义子应用的目标容器。
3. 主应用容器和子应用目标容器 不能使用同一个id 会出现挂载失败或者样式丢失的现象
4. 但是如果是线上地址，就没有配置html的选项，这个时候我们就需要在主应用中提前把 #son 的容器写进去，但还是要保证 两个id不可重复

### activeRule 对应 子应用路由中的前缀不对应的问题

1. 由主应用去决定子应用的前缀


```javascript
export default function generateRouter(base) {
    const router = createRouter({
        history: createWebHistory(base ?? '')
    })
}
```

## 沙箱机制


```javascript
start({
    sandbox: false
})
```

### 隔离样式

默认不隔离全局样式

experimentalStyleIsolation ：true


## 父子应用通讯

### initGlobalState
qiankun 自带的全局状态系统   适用于简单的数据共享，他不是响应式的 需要手动触发 

```javascript
import { initGlobalState, MicroAppStateActions } from 'qiankun';

// 初始化 state
const actions: MicroAppStateActions = initGlobalState(state);

actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log(state, prev);
});
actions.setGlobalState(state);
actions.offGlobalStateChange();
```

然后可以将 actions 和 setGlobalState 方法通过props 传递给子应用 

```javascript
// 从生命周期 mount 中获取通信方法，使用方式和 master 一致
export function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
  });

  props.setGlobalState(state);
}
```

### pinia



```javascript

import {defineStore} from "pinia";
import {ref} from "vue";

defineStore('global', () => {
    const a = ref("")
})
```

### eventBus 

发布订阅模式 实现数据传递
