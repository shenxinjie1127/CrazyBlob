---
icon: akar-icons:file
date: 2026-05-01
order: 4
category:
  - Three
---

# geometry(几何体)



## BufferGeometry(缓冲几何体)

是大部分几何体的基类 其他几何体都是继承自它的

```javascript
const geometry = new THREE.BufferGeometry();
```
buffer几何体是需要手动定义顶点的

```javascript
const vertices = new Float32Array([
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0,1.0, 0.0,
    -1.0, 1.0, 0.0,
])
```

告诉threejs 这个几何体的顶点是上面定义的这些点 每三个数字为一个顶点

BufferAttribute 是一个类 用来表示一个属性 这个属性可以是顶点位置、法线、颜色等

传入一个数组，告诉他几个为一组 这里就上三个顶点绘制成一个三角形

```javascript
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
```
接下来就可以把材质附上去了

```javascript
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material); 
```
### 正反面

- 正面： 逆时针
- 反面： 顺时针

### 材质渲染的正反面

材质默认是正面可见的，反面不可见

- side: THREE.FrontSide // 默认值 只渲染正面
- side: THREE.BackSide // 只渲染反面
- side: THREE.DoubleSide // 渲染正反面

### 用三角形构成一个平面
几何体实际上是由多个三角形组成的

比如形成一个正方形的面需要两个 三角形

```javascript
const vertices = new Float32Array([
    // 第一个面
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0,1.0, 0.0,
    // 第二个面
    1.0,1.0, 0.0,
    -1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
])
```

但是其中两个点是重复的  重复的点是可以复用的,于是改成这样 但是需要添加索引 让它知道这个三角形用了哪些点

```javascript
const vertices = new Float32Array([
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0,1.0, 0.0,
    -1.0, 1.0, 0.0,
])

const indices = new Uint16Array([0,1,2,2,3,0])
// 给几何体赋予 面的位置和索引
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
// 设置索引
geometry.setIndex(new THREE.BufferAttribute(indices,1))
```

::: info 注意
顶点是有顺序的 逆时针为正面，
:::

每个三角形相当于一个小面  每个面都可以设置各自的材质 包括正反

可以使用addGroup 方法 为每个面设置对应的材质

param
- start 起始点
- count 几位数字
- materialIndex 材质序号

```javascript
geometry.addGroup(0, 3, 0);
geometry.addGroup(3,3, 1)
const material1 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    // 线框
    wireframe: true
})
const material2 = new THREE.MeshBasicMaterial({
    color: 0xff0000,
})
const cube = new THREE.Mesh(geometry, [material1, material2]);
// 这里就给两个不同的三角形赋予了不同的材质
```

定义法线数据

```javascript
const normals = new Float32Array([
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
])
geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3))
```

wireframe 模式下 线条也是由顶点组成的 也可以用上面的方法为线条设置材质

```javascript
const material = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
 wireframe: true
})
```

### 旋转 缩放  平移

这些方法本质上是改变了顶点的数据

```javascript
geometry.translate(1, 0, 0); // 平移
geometry.rotateX(Math.PI / 4); // 旋转
geometry.rotateY(Math.PI / 4); // 旋转
geometry.rotateZ(Math.PI / 4); // 旋转
geometry.scale(2, 2, 2); // 缩放
```

### 居中

使用center方法可以将几何体的中心点移动到坐标原点(0, 0, 0)，这对于一些几何体来说是非常有用的，特别是当你想要将它们放置在场景中的特定位置时。
```javascript
geometry.center();
```


## BoxGeometry(立方缓冲几何体 长方体)

BoxGeometry 有六个面 可以用上面的方法为各自的面设置各自的材质

```javascript
const boxGeoMetry = new BoxGeometry(1,1,1)

const meterial0 = new THREE.MeshBsicMaterial({
 color: 0x00ff00
})
const meterial1 = new THREE.MeshBsicMaterial({
 color: 0x00ff00
})
const meterial2 = new THREE.MeshBsicMaterial({
 color: 0x00ff00
})
const meterial3 = new THREE.MeshBsicMaterial({
 color: 0x00ff00
})
const meterial4 = new THREE.MeshBsicMaterial({
 color: 0x00ff00
})
const meterial5 = new THREE.MeshBsicMaterial({
 color: 0x00ff00
})

const cube = new THREE.Mesh(geometry, [meterial0, meterial1,meterial2, meterial3, meterial4, meterial5])
```

## SphereGeometry(球体缓冲几何体)

`
const sphereGeometry = new THREE.SphereGeometry(radius);
`

细分数 withSegments heightSegments

```javascript
const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
```
分的数量越多，球体就越平滑，但同时也会增加渲染的计算量。通常情况下，32个宽度分段和16个高度分段已经足够创建一个平滑的球体。

细分数越多，也就是顶点的数量越多，会直接影响渲染的性能，在不影响效果的前提下，尽可能的减少细分数，可以提高渲染性能。

## CylinderGeometry(圆柱缓冲几何体)

```javascript
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
```
## PlaneGeometry(平面缓冲几何体)

```javascript
const planeGeometry = new THREE.PlaneGeometry(1, 1);
```

## CircleGeometry(圆形缓冲几何体)

```javascript
const circleGeometry = new THREE.CircleGeometry(1, 32);
```