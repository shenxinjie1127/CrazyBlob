---
icon: akar-icons:file
date: 2026-03-11
order: 1
category:
  - Three
---

# Three 起步

## 创建一个场景 + 相机 + 渲染器

```ts
import * as THREE from "three";

const scene = new THREE.Scene();

// 创建一个透视相机  第一个参数是视野范围  第二个参数是宽高比  第三个参数是近裁剪面  第四个参数是远裁剪面
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
```

## 添加一个物体

```ts
// 创建一个几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 创建一个材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 创建一个网格
const cube = new THREE.Mesh(geometry, material);

// 将网格添加到场景中
scene.add(cube);
```

## 渲染场景

```ts
renderer.render(scene, camera);
```
## 控制器

添加轨道控制器

```ts
// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  // 更新轨道控制器
  controls.update();
  renderer.render(scene, camera);
}
```

## 辅助坐标系

添加辅助坐标系 (出现x轴(红色)、y轴(绿色)、z轴(蓝色))

```ts
// 添加辅助坐标系
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
```

## 本地坐标和世界坐标

每个物体都有一个本地坐标系和一个世界坐标系，本地坐标系是相对于物体自身的坐标系，世界坐标系是相对于整个场景的坐标系。

```ts
// 获取物体的本地坐标
const localPosition = cube.position;    
```

```ts
// 获取物体的世界坐标
const worldPosition = new THREE.Vector3();
cube.getWorldPosition(worldPosition);
```

## 常见场景 

### Canvas 随窗口尺寸变化

```javascript
// 画布跟随窗口变化
window.onresize = function () {
    const width = window.innerWidth - 200; //canvas画布高度
    const height = window.innerHeight - 60; //canvas画布宽度
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

```

###  背景透明度

```javascript
// 设置背景透明度
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0); // 第二个参数是透明度，0表示完全透明，1表示完全不透明

renderer.setClearAlpha(0); // 设置背景透明度为0，完全透明
```
### threejs 渲染结果保存为图片


```html
<button type="button" name="button" onclick="saveFile()">下载</button>
<script>
  function saveFile() {
    // 创建一个超链接元素，用来下载保存数据的文件
    const link = document.createElement('a');
    // 通过超链接herf属性，设置要保存到文件中的数据
    link.href = window.URL.createObjectURL(new Blob(['一些数据']));
    link.download = '文件名称.txt';//下载文件名
    link.click();//js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
  }
</script>

```

1. 配置渲染器 preserveDrawingBuffer 属性为 true，确保渲染结果保存在画布中：
2. canvas.toDataURL() 方法将画布内容转换为数据URL，获取渲染结果的图像数据。


### 深度冲突(模型闪烁)

下面代码创建两个重合的矩形平面Mesh，通过浏览器预览，当你旋转三维场景的时候，你会发现模型渲染的时候产生闪烁。

这种现象，主要是两个Mesh重合，电脑GPU分不清谁在前谁在后，这种现象，可以称为深度冲突Z-fighting。

```javascript
// 两个矩形平面Mesh重合，产生闪烁
// 闪烁原因：两个矩形面位置重合，GPU无法分清谁在前谁在后
const geometry = new THREE.PlaneGeometry(250, 250);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);


const geometry2 = new THREE.PlaneGeometry(300, 300); 
const material2 = new THREE.MeshLambertMaterial({
    color: 0xff6666,
    side: THREE.DoubleSide,
});
const mesh2 = new THREE.Mesh(geometry2, material2);

```

1. logarithmicDepthBuffer 属性：在创建 WebGLRenderer 时，将 logarithmicDepthBuffer 设置为 true，可以使用对数深度缓冲区来提高深度精度，减少深度冲突的发生。

### 模型加载进度
```javascript
loader.load("../工厂.glb", function (gltf) {
    model.add(gltf.scene);
}, function (xhr) {
    // 控制台查看加载进度xhr
    // 通过加载进度xhr可以控制前端进度条进度   
    const percent = xhr.loaded / xhr.total;
    console.log('加载进度' + percent);
})
```