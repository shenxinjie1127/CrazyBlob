---
icon: akar-icons:file
date: 2025-08-21
order: 5
category:
  - Function
---

# 撤回重做 - 命令模式

## 概述

命令模式（Command Pattern）是一种行为型设计模式，它将请求封装为对象，从而使你可以参数化操作、队列化操作、撤销操作和重做操作。

### 核心思想

```
┌─────────────────────────────────────────────────────────────────┐
│                         命令模式结构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐        ┌──────────────┐        ┌──────────┐│
│   │    调用者    │────────▶│ 命令接口     │────────▶│ 具体命令 ││
│   │  Invoker     │        │  Command     │        │ConcreteCmd││
│   └──────────────┘        └──────────────┘        └──────────┘│
│          │                                                │     │
│          │                                                ▼     │
│          │               ┌──────────────┐        ┌────────────┐│
│          └──────────────▶│   接收者     │◀───────│  execute  ││
│                          │  Receiver    │        │   undo    ││
│                          └──────────────┘        └────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 本文档实现特点

- 支持操作记录和撤销/重做
- 采用栈结构存储命令历史
- 支持跳转到任意历史操作点
- 可配置最大记录数量，防止内存溢出

---

## 类型定义

```typescript
export type BaseMode = string | number;

export interface CommandResult {
  success: boolean;
  message?: string;
  data?: any;
}

export interface EventBus {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, ...args: any[]): void;
}
```

---

## 命令接口

### Command 接口定义

```typescript
export interface Command<T = any> {
  id: number;
  label: string;
  validateModelSet: Set<BaseMode>;
  execute: (recordCommand: boolean) => CommandResult;
  doExecute: () => CommandResult;
  redo: () => CommandResult;
  undo: () => CommandResult;
}
```

### 接口属性说明

| 属性               | 类型            | 说明                               |
| ------------------ | --------------- | ---------------------------------- |
| `id`               | `number`        | 命令唯一标识                       |
| `label`            | `string`        | 命令描述名称                       |
| `validateModelSet` | `Set<BaseMode>` | 命令关联的校验模块集合             |
| `execute`          | `Function`      | 执行命令（可选择是否记录到命令栈） |
| `doExecute`        | `Function`      | 实际执行逻辑的抽象方法             |
| `redo`             | `Function`      | 重做操作                           |
| `undo`             | `Function`      | 撤销操作                           |

---

## 抽象命令实现

```typescript
export abstract class AbstractCommand<T = any> implements Command<T> {
  public id: number;
  public label: string;
  public validateModelSet: Set<BaseMode> = new Set();

  protected constructor(id: number, label: string) {
    this.id = id;
    this.label = label;
  }

  public redo(): CommandResult {
    return this.doExecute();
  }

  abstract undo(): CommandResult;

  abstract doExecute(): CommandResult;

  public execute(recordCommand = true): CommandResult {
    this.recordLocation();
    const doExecuteResult = this.doExecute();
    if (recordCommand) {
      this.app.commandManage.recordCommand(this);
    }
    return doExecuteResult;
  }

  protected recordLocation(): void {
    // 记录当前位置，供撤销/重做使用
  }
}
```

### 核心设计说明

| 方法          | 说明                                               |
| ------------- | -------------------------------------------------- |
| `redo()`      | 复用 `doExecute()` 的实现，重做就是重新执行        |
| `undo()`      | 抽象方法，由具体命令实现撤销逻辑                   |
| `doExecute()` | 抽象方法，实现具体的业务逻辑                       |
| `execute()`   | 模板方法，封装通用流程：记录位置 → 执行 → 记录命令 |

---

## 命令管理器

### 接口定义

```typescript
export interface ICommandManage {
  getActiveCommandId(): UndefinedAble<number>;
  getHistory(): Command[];
  next(): void;
  back(): void;
  gotoCommand(targetCommandId: number): void;
  recordCommand(command: Command): void;
}
```

### 核心属性

| 属性            | 类型        | 说明                         |
| --------------- | ----------- | ---------------------------- |
| `commandStack`  | `Command[]` | 命令栈，存储所有执行过的命令 |
| `activeCommand` | `Command`   | 当前激活的命令指针           |
| `maxStack`      | `number`    | 最大记录数，默认 50          |
| `eventBus`      | `EventBus`  | 事件总线，用于通知命令变化   |

### 完整实现

```typescript
export class CommandManage implements ICommandManage {
  private commandStack: Command[] = [];
  private activeCommand?: Command;
  private maxStack = 50;
  private eventBus: EventBus = new EventBus();

  public getActiveCommandId(): UndefinedAble<number> {
    return this.activeCommand?.id;
  }

  public getHistory(): Command[] {
    return [...this.commandStack];
  }

  public next(): void {
    const index = this.commandStack.findIndex(
      (it) => it.id === this.getActiveCommandId(),
    );
    if (index > -1 && index < this.commandStack.length - 1) {
      this.gotoCommand(this.commandStack[index + 1].id);
    } else if (index === -1 && this.commandStack.length) {
      this.gotoCommand(this.commandStack[0].id);
    }
  }

  public back(): void {
    const activeCommandId = this.getActiveCommandId();
    if (activeCommandId) {
      this.gotoCommand(activeCommandId);
    }
  }

  public gotoCommand(targetCommandId: number): void {
    const targetCommand = this.commandStack.find(
      (item) => item.id === targetCommandId,
    );
    if (!targetCommand) return;

    const targetIndex = this.commandStack.findIndex(
      (item) => item.id === targetCommandId,
    );
    const commandResults: CommandResult[] = [];
    const prevCommandId = this.getActiveCommandId();

    if (!prevCommandId) {
      for (let i = 0; i <= targetIndex; i++) {
        const commandResult = this.commandStack[i].redo();
        commandResults.push(commandResult);
      }
      this.activeCommand = targetCommand;
    } else {
      const prevIndex = this.commandStack.findIndex(
        (item) => item.id === prevCommandId,
      );

      if (prevIndex >= targetIndex) {
        for (let i = prevIndex; i >= targetIndex; i--) {
          const commandResult = this.commandStack[i].undo();
          commandResults.push(commandResult);
          this.activeCommand = targetIndex
            ? this.commandStack[targetIndex - 1]
            : undefined;
        }
      } else {
        for (let i = prevIndex + 1; i <= targetIndex; i++) {
          const commandResult = this.commandStack[i].redo();
          commandResults.push(commandResult);
        }
        this.activeCommand = targetCommand;
      }
    }

    this.eventBus.emit("commandChanged", {
      targetCommand,
      results: commandResults,
    });
  }

  public recordCommand(command: Command): void {
    if (this.commandStack.length > 0) {
      const currentIndex = this.commandStack.findIndex(
        (item) => item.id === this.getActiveCommandId(),
      );

      if (
        currentIndex + 1 === this.commandStack.length &&
        currentIndex + 1 >= this.maxStack
      ) {
        this.commandStack.shift();
      }

      if (this.commandStack.length - 1 > currentIndex) {
        countNeverZero(this.maxStack + 1);
        this.commandStack.splice(currentIndex + 1);
      }
    }

    this.commandStack.push(command);
    this.activeCommand = command;
    this.eventBus.emit("commandRecorded", command);
  }
}
```

---

## 操作流程图

### 命令执行流程

```
用户触发操作
     │
     ▼
┌─────────────┐
│ 创建命令对象 │
└─────────────┘
     │
     ▼
┌─────────────┐
│ 执行 execute │
└─────────────┘
     │
     ├────────────────────────────┐
     ▼                            ▼
┌─────────────┐            ┌─────────────┐
│ doExecute  │            │ 记录到命令栈 │
│ (执行业务)  │            │ recordCommand│
└─────────────┘            └─────────────┘
     │                            │
     ▼                            ▼
┌─────────────┐            ┌─────────────┐
│ 返回结果   │            │ 更新指针    │
└─────────────┘            └─────────────┘
```

### 撤销/重做流程

```
┌──────────────────────────────────────────────────────────────┐
│                       gotoCommand(targetId)                   │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ 获取当前指针位置     │
                    │ prevIndex            │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ targetIndex > prev? │
                    └──────────┬──────────┘
                              │
                ┌─────────────┴─────────────┐
               是                          否
                │                          │
                ▼                          ▼
        ┌───────────────┐          ┌───────────────┐
        │ 执行 redo     │          │ 执行 undo     │
        │ prev+1 → target│         │ prev → target │
        └───────────────┘          └───────────────┘
                │                          │
                └──────────────┬───────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ 更新 activeCommand  │
                    └─────────────────────┘
```

---

## 具体命令示例

### 添加元素命令

```typescript
export class AddElementCommand extends AbstractCommand {
  private element: any;

  constructor(id: number, element: any) {
    super(id, `添加元素: ${element.label}`);
    this.element = element;
  }

  public doExecute(): CommandResult {
    try {
      this.app.canvas.addElement(this.element);
      return { success: true, data: this.element };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  public undo(): CommandResult {
    try {
      this.app.canvas.removeElement(this.element.id);
      return { success: true };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
```

### 删除元素命令

```typescript
export class DeleteElementCommand extends AbstractCommand {
  private element: any;
  private index: number;

  constructor(id: number, element: any, index: number) {
    super(id, `删除元素: ${element.label}`);
    this.element = element;
    this.index = index;
  }

  public doExecute(): CommandResult {
    try {
      this.app.canvas.removeElement(this.element.id);
      return { success: true };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  public undo(): CommandResult {
    try {
      this.app.canvas.insertElement(this.element, this.index);
      return { success: true };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
```

### 移动元素命令

```typescript
export class MoveElementCommand extends AbstractCommand {
  private element: any;
  private fromPosition: { x: number; y: number };
  private toPosition: { x: number; y: number };

  constructor(
    id: number,
    element: any,
    from: { x: number; y: number },
    to: { x: number; y: number },
  ) {
    super(id, `移动元素: ${element.label}`);
    this.element = element;
    this.fromPosition = from;
    this.toPosition = to;
  }

  public doExecute(): CommandResult {
    try {
      this.element.setPosition(this.toPosition);
      return { success: true };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  public undo(): CommandResult {
    try {
      this.element.setPosition(this.fromPosition);
      return { success: true };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
```

---

## 使用示例

### 基础用法

```typescript
const commandManage = new CommandManage();

const addCmd = new AddElementCommand(1, { id: "ele1", label: "矩形" });
addCmd.execute();

const moveCmd = new MoveElementCommand(
  2,
  { id: "ele1", label: "矩形", setPosition: fn },
  { x: 0, y: 0 },
  { x: 100, y: 100 },
);
moveCmd.execute();

console.log(commandManage.getHistory());
// [AddElementCommand, MoveElementCommand]

commandManage.back();
console.log(commandManage.getActiveCommandId());
// 1

commandManage.next();
console.log(commandManage.getActiveCommandId());
// 2
```

### 跳转到指定操作

```typescript
commandManage.gotoCommand(1);
console.log(commandManage.getActiveCommandId());
// 1
```

### 监听命令变化

```typescript
commandManage.eventBus.on("commandChanged", ({ targetCommand, results }) => {
  console.log(
    `已${results.length > 0 ? "执行" : "撤销"}命令: ${targetCommand.label}`,
  );
});

commandManage.eventBus.on("commandRecorded", (command) => {
  console.log(`新命令: ${command.label}`);
});
```

---

## 设计优势

| 优势          | 说明                                          |
| ------------- | --------------------------------------------- |
| **撤销/重做** | 每个命令都包含 undo/redo 方法，支持撤销和重做 |
| **操作记录**  | 所有命令都记录到栈中，可追溯历史操作          |
| **批量操作**  | 支持跳转到任意操作点，实现批量撤销/重做       |
| **解耦合**    | 命令与执行者分离，便于维护和扩展              |
| **可组合**    | 可将多个命令组合成一个宏命令                  |

---

## 注意事项

1. **内存限制**：设置合理的 `maxStack`，防止命令历史过多占用内存
2. **命令粒度**：根据业务需求选择合适的命令粒度，过细会导致操作繁琐，过粗会影响撤销精度
3. **状态保存**：在执行 undo/redo 时，需要确保应用状态一致
4. **异步操作**：如果命令涉及异步操作，需要处理好竞态条件
5. **命令顺序**：在实现 `gotoCommand` 时，需要正确处理 prevIndex 和 targetIndex 的关系
