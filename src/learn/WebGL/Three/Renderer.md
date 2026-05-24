---
icon: akar-icons:file
date: 2026-05-06
order: 3
category:
- Three
---
# Renderer

## WebGLRenderer
渲染器执行渲染方法 `render()` 就可以生成一个Canvas画布，并把三维场景Scene 渲染到这个画布上，可以把`render` 理解为相机拍照的动作


`renderer.render(scene, camera)`

### properties

- antialias: 是否开启抗锯齿，默认为 false，开启后可以让渲染的图像更平滑，但会降低性能。


### functions
- `setSize(width, height)`: 设置渲染器的尺寸，单位是像素。
- `render(scene, camera)`: 渲染场景，参数是场景对象和相机对象。
- `setPixelRatio(value)`: 设置渲染器的像素比，通常用于处理高分辨率屏幕上的渲染质量问题。
- `setClearColor(color, alpha)`: 设置渲染器的清除颜色和透明度，参数 color 可以是一个颜色值，alpha 是一个介于 0 和 1 之间的值，表示透明度。



## 全屏渲染

```javascript
const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

```

```css
body {
    margin: 0;
    overflow: hidden;
}
```

## 画布宽高动态变化

```javascript
window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    // 相机属性发生变化，需要更新投影矩阵
    camera.updateProjectionMatrix();
})
```