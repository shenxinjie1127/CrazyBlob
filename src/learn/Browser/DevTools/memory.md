---
icon: akar-icons:file
date: 2024-11-14
order: 2
category:
  - DevTools
---

# Memory 面板（内存面板）| Performance monitor 性能监控面板

## Memory 面板

适用于内存泄露排查

Heap snapshot 堆快照 对比找出未释放的对象

Allocation Timeline 分配时间线 展示对象分配和释放时间

Allocation Sampler 分析内存占用的函数来源

**常见的内存泄露来源**

- 事件监听未释放
- dom引用未释放
- 定时器未清除
- 闭包未释放
- 全局变量的累积

## Performance monitor 面板

适用于性能监控

**常见的性能指标**

CPU usage CPU 占用率

Js Heap JavaScript 堆内存占用

Dom Node DOM 节点数量

比如 在发现操作某个步骤的时候 发现 CPU 占用率异常高 那么就可以去分析是哪个函数占用了 CPU 资源

比如 堆内存占用不断上分，无法被垃圾回收，那么就可以去分析是哪个函数占用了内存， 可能出现内存泄露
