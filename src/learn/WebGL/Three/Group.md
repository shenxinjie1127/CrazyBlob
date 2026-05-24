---
icon: akar-icons:file
date: 2026-05-08
order: 4
category:
- Three
---

# Group

Group 是 threejs 中的一个对象，用于将多个对象组合在一起，形成一个整体。Group 本身不具有几何体和材质，但可以包含多个子对象，这些子对象可以是 Mesh、Line、Points 等。


主要是为了做分组管理，把一部分当做一个整体来进行操作，比如旋转、缩放、平移等。Group 也可以嵌套使用，一个 Group 中可以包含另一个 Group，这样就形成了层级关系。

以mesh 为例
```javascript

//创建两个网格模型mesh1、mesh2
const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshLambertMaterial({color: 0x00ffff});
const group = new THREE.Group();
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material);
mesh2.translateX(25);
//把mesh1型插入到组group中，mesh1作为group的子对象
group.add(mesh1);
//把mesh2型插入到组group中，mesh2作为group的子对象
group.add(mesh2);
//把group插入到场景中作为场景子对象
scene.add(group);

```