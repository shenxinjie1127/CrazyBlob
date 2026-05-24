---
icon: akar-icons:file
date: 2026-03-12
order: 3
category:
  - Three
---

# 本地调试工具 lil-gui

## 使用


```ts
import GUI from "lil-gui";

const gui = new GUI();

const eventObj = {
  fullScreen: () => {
    document.body.requestFullscreen();
  },
  size: 0,
};

gui.add(eventObj, "fullScreen").name("全屏");

gui.add(cube.position, "x").min(-10).max(10).step(0.1).name("立方体位置 x");

gui
  .add(eventObj, "size")
  .min(0)
  .max(100)
  .step(1)
  .name("立方体大小")
  .onChange((value) => {
    cube.scale.set(value, value, value);
  });
```

## add 方法

add 方法用于添加一个控件到 GUI 中。 add方法可以改变对象的某个属性

```ts
gui.add(object, property).name(label);
```

- `object`：要添加控件的对象。
- `property`：要添加控件的属性名。一般来说是个方法
- `label`：控件的显示名称。

## 常用

- `gui.add(object, property).name(label)`：添加一个数值控件。
- `gui.add(object, property).name(label).min(min).max(max).step(step)`：添加一个数值控件，设置最小值、最大值和步长。
- `gui.add(object, property).name(label).onChange(callback)`：添加一个数值控件，当值改变时调用回调函数。
- `gui.add(object, property).name(label).onFinishChange(callback)`：添加一个数值控件，改变结束后调用回调函数。


1. `.name(label)`：设置控件的显示名称。
2. `.min(min)`：设置数值控件的最小值。
3. `.max(max)`：设置数值控件的最大值。
4. `.step(step)`：设置数值控件的步长。
5. `.onChange(callback)`：当控件的值改变时调用回调函数
6. `.onFinishChange(callback)`：当控件的值改变结束时调用回调函数。
7. `.listen()`：监听对象属性的变化，当属性值改变时自动更新控件的显示值。

## 添加组（文件夹）

addFolder 方法用于添加一个文件夹到 GUI 中。 对控制面板做分组控制。

```ts
const folder = gui.addFolder(label);
folder.add(object, property).name(label);
```

- `label`：文件夹的显示名称。


## 颜色控制
addColor 方法用于添加一个颜色控件到 GUI 中。

```ts
gui.addColor(object, property).name(label);
```

- `object`：要添加控件的对象。
- `property`：要添加控件的属性名。一般来说是个方法
- `label`：控件的显示名称。


## 下拉菜单
add 方法也可以用于添加一个下拉菜单控件到 GUI 中。 但是需要传入一个数组作为选项。或者传入一个对象


`gui.add( myObject, 'myNumber', [ 0, 1, 2 ] );`

`gui.add( myObject, 'myNumber', { Label1: 0, Label2: 1, Label3: 2 } );`

## 按钮

当传入的属性是方法的时候 add 方法会创建一个按钮控件，点击按钮会调用该方法。


## 单选框

当传入的属性是布尔值的时候 add 方法会创建一个单选框控件，点击单选框会切换该属性的值。