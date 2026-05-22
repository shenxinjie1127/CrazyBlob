---
icon: akar-icons:file
date: 2026-05-06
order: 5
category:
- Three
---

# OrbitControls(轨道控制器)


主要就是改变相机的位置进行拍照，`OrbitControls` 可以让我们通过鼠标操作来改变相机的位置，从而实现旋转、缩放和平移等功能。

`const controls = new OrbitControls(camera, renderer.domElement)`
- camera: 需要控制的相机对象
- renderer.domElement: 监听鼠标事件的 DOM 元素，通常是渲染器的 DOM 元素