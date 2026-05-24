---
icon: akar-icons:file
date: 2026-03-11
order: 2
category:
  - Three
---

# Object3D

## 三维向量 Vector3
点模型`Points`、线模型`Line`、网格网格模型`Mesh`等模型对象的父类都是Object3D，如果想对这些模型进行旋转、缩放、平移等操作，如何实现

### new Vector3(x, y, z)
Vector3是一个三维向量类，表示一个三维空间中的点或者一个三维空间中的向量。它有三个属性x、y、z，分别表示三维空间中的三个坐标轴上的值。

```ts
const vector = new THREE.Vector3(1, 2, 3);
vector.set(4, 5, 6);
```

### 位置控制 position 

每个物品放入场景的时候都需要一个mesh(网格)，mesh是一个物体的基本单位，每个mesh都有一个position属性，position属性是一个Vector3对象，用来表示物体的位置。
position属性有三个属性x、y、z，分别表示物体在三个轴上的位置。

#### 平移控制 translateX、translateY、translateZ

```ts
// 沿着x轴平移1个单位
mesh.translateX(1);
```


[//]: # (**在mesh 中添加 mesh**)

[//]: # ()
[//]: # (```ts)

[//]: # (const geometry = new THREE.BoxGeometry&#40;1, 1, 1&#41;;)

[//]: # (const PMaterial = new THREE.MeshBasicMaterial&#40;{ color: 0x00ff00 }&#41;;)

[//]: # (const PCube = new THREE.Mesh&#40;geometry, PMaterial&#41;;)

[//]: # (const material = new THREE.MeshBasicMaterial&#40;{ color: 0x00ff00 }&#41;;)

[//]: # (const cube = new THREE.Mesh&#40;geometry, material&#41;;)

[//]: # (PCube.add&#40;cube&#41;;)

[//]: # (scene.add&#40;PCube&#41;;)

[//]: # (```)

[//]: # (这样 子网格的位置就会现对于父网格的位置)

#### 缩放控制 scale

每个物品放入场景的时候都需要一个mesh(网格)，mesh是一个物体的基本单位，每个mesh都有一个scale属性，scale属性是一个Vector3对象，用来表示物体的缩放比例。

```ts
// 设置物体缩放比例
mesh.scale.set(2, 2, 2);
```

## Euler(欧拉角)

欧拉角通过在各个轴上以指定的顺序旋转一定角度来描述旋转变换。

```javascript
const euler = new THREE.Euler(0, Math.PI / 2, 0, 'XYZ');
mesh.rotation.copy(euler);
```

## Color(颜色对象)
Color对象是一个表示颜色的类，它有三个属性r、g、b，分别表示红色、绿色、蓝色的值，范围是0-1。

```ts
const color = new THREE.Color(0xff0000);
const color1 = new THREE.Color('rgb(255, 0, 0)');
mesh.material.color.copy(color);
```

### 常用方法

- setHex(hex): 设置颜色为十六进制值
- setRGB(r, g, b): 设置颜色为RGB值
- setHSL(h, s, l): 设置颜色为HSL值
- setStyle(style): 设置颜色为CSS样式字符串

## clone 和 copy
| 对比项 | `.copy(v)` | `.clone()` |
|--------|-----------|-----------|
| **返回值** | `this`（自身） | 新的实例 |
| **原对象** | 被修改 | 不变 |
| **创建新对象** | ❌ 否 | ✅ 是 |
| **常用场景** | "让 A = B" | "复制 A 得到 A'" |
| **内存** | 无额外开销 | 每次 clone 分配新内存 |


## traverse 和 traverseVisible
- `traverse(callback)`: 遍历对象及其所有子对象，执行回调函数。
- `traverseVisible(callback)`: 仅遍历可见对象及其子对象，执行回调函数。

## getObjectByName(name)
根据名称获取对象及其子对象中第一个匹配的对象。


## remove(object)
从父对象中移除当前对象。

## visible
一个布尔值，表示对象是否可见。默认值为true。如果设置为false