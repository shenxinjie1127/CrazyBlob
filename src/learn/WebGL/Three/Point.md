---
icon: akar-icons:file
date: 2026-05-07
order: 4
category:
- Three
---

# point(点模型)
点模型和网格模型（Mesh）一样，都是threejs的一种模型对象，大部分情况下都是用mesh表示物体


`const points = new THREE.Points(geometry, material)`

当然点也有自己的材质

```js 
const material = new THREE.PointsMaterial({
    color: 0x00ff00, // 点的颜色
    size: 0.1, // 点的大小
    sizeAttenuation: true, // 是否根据距离衰减点的大小
});
```