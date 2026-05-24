---
icon: akar-icons:file
date: 2026-05-06
order: 5
category:
  - Three
---

# Material(材质)

- opacity: 透明度，默认1，值越小越透明
- transparent: 是否启用透明度，默认false，如果需要透明效果，需要设置为true
- side: 材质的面，默认THREE.FrontSide，值可以是THREE.FrontSide（只渲染正面），THREE.BackSide（只渲染反面），THREE.DoubleSide（渲染正反面）
- visible: 是否可见，默认true，如果设置为false，物体将不可见

## MeshBasicMaterial（简单基础材质）
不受光照影响，颜色和贴图显示不受光照影响，适合做一些特殊效果的材质。

```javascript

// 贴图加载器
const loader = new THREE.TextureLoader()
const texture = loader.load('../xxx')
// ao贴图
const aoTexture = loader.load('../xxx')

// 透明度贴图
const alphaMap = loader.load('./xxx')

// 光照贴图

const lightMap = loader.load('../xx')

// 高光贴图

const specularMap = loader.load('../xx')





const material = new THREE.MeshBasicMaterial({
    // 颜色
    color: 0xffffff,
    // 颜色贴图。可以包含 alpha 通道
    map: texture,
    // 此纹理的红色通道用作环境光遮蔽贴图
    aoMap: aoTexture,
    // 环境遮蔽效果强度  0-1  0是不遮挡效果 默认1
    aoMapIntensity: 1,
    alphaMap:alphaMap,
    lightMap: lightMap,
    specularMap: specularMap,
    reflectivity: 0.5, // 反射率，默认0.5
})
```

## MeshLambertMaterial（朗伯网格材质）
一种网格模型的Mesh 材质，支持漫反射效果，适合用来模拟非金属材质，如木材、石头等。

## MeshPhongMaterial（高光网格材质）

是一种网格模型的Mesh 材质，支持高光效果，适合用来模拟金属、塑料等材质。

一种镜面反射效果，如果反射光对着相机，就会看到高光效果，反之就看不到高光效果。

### properties

- shininess: 高光的亮度，默认30，值越大高光越亮
- specular: 高光的颜色，默认0x111111(深灰色)，值越大高光越亮

```javascript
```

##  MeshStandardMaterial（标准网格材质）

基于物理的光照模型 比上面的材质更加逼真，更加接近生活中的材质效果，适合用来模拟各种材质，如金属、塑料、木材等。

### metalness: 金属度，默认0，值越大越像金属
金属度属性metalness表示材质像金属的程度, 非金属材料,如木材或石材,使用0.0,金属使用1.0。
### roughness: 粗糙度，默认1，值越小越光滑
粗糙度roughness表示模型表面的光滑或者说粗糙程度，越光滑镜面反射能力越强，越粗糙，表面镜面反射能力越弱，更多地表现为漫反射。

## MeshPhysicalMaterial（物理网格材质）

MeshPhysicalMaterial和MeshStandardMaterial都是拥有金属度metalness、粗糙度roughness属性的PBR材质，MeshPhysicalMaterial是在MeshStandardMaterial基础上扩展出来的子类，除了继承了MeshStandardMaterial的金属度、粗糙度等属性，还新增了清漆.clearcoat、透光率.transmission、反射率.reflectivity、光泽.sheen、折射率.ior等等各种用于模拟生活中不同材质的属性。

### clearcoat: 清漆，默认0，值越大越像清漆
可以用来模拟物体表面一层透明图层，类似于汽车表面的一层清漆，值越大越像清漆。

### clearcoatRoughness: 清漆粗糙度
可以用来模拟物体表面一层透明图层的粗糙程度，值越小越光滑，值越大越粗糙。

### transmission: 透光率，默认0，值越大越透明
可以用来模拟物体的透明程度，值越大越透明。

### ior : 折射率，默认1.5，值越大折射效果越明显 
非金属 材质 1.0 - 2.333


## 加载hdr 背景贴图

```javascript
const loader = new THREE.HDRLoader()

const envMap = await loader.loadAsync('../xxx.hdr')

envMap.mapping = THREE.EquirectangularReflectionMapping
scene.background = envMap
scene.environment = envMap
// 给平面设置环境贴图
planMaterial.envMap = envMap
```

## 通过uv 顶点坐标设置贴图

### 顶点uv 坐标的作用

顶点uv坐标是用来告诉threejs 这个顶点在贴图上的位置的，uv坐标是一个二维坐标系，u表示水平方向，v表示垂直方向，值的范围是0-1，(0,0)表示贴图的左下角，(1,1)表示贴图的右上角。

通过顶点来控制贴图的显示位置和大小，可以实现一些特殊的效果，比如说把贴图的一部分显示在物体上，或者说把贴图重复显示在物体上。

```javascript
/**纹理坐标0~1之间随意定义*/
const uvs = new Float32Array([
        0, 0, //图片左下角
        1, 0, //图片右下角
        1, 1, //图片右上角
        0, 1, //图片左上角
    ]);
// 设置几何体attributes属性的位置normal属性
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标

```

**圆形平面 纹理的设置**
内置就是通过uv坐标来控制贴图的显示位置和大小的，所以我们只需要设置好uv坐标就可以


## 纹理阵列
纹理阵列是指在一个贴图中包含多个纹理，通过uv坐标来控制显示哪个纹理，可以实现一些特殊的效果，比如说把不同的纹理显示在不同的物体上，或者说把同一个纹理重复显示在多个物体上。

比如我有一个地面 需要很多块瓷砖
```javascript
const geometry = new THREE.PlaneGeometry(2000, 2000);
//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load('./瓷砖.jpg');
const material = new THREE.MeshLambertMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture,//map表示材质的颜色贴图属性
});
const mesh = new THREE.Mesh(geometry, material);

```

把纹理重复显示在地面上 需要设置纹理的阵列模式和重复数量

```javascript
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load('./瓷砖.jpg');
// 设置阵列模式
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
texture.repeat.set(12,12);//注意选择合适的阵列数量

```
## uv动画

纹理对象的偏移属性.offset 可以实现uv动画效果，通过不断改变offset的值来实现纹理的移动效果。


### 纹理对象.wrapS或.wrapT与.offset组合使用

当你通过.offset设置了纹理映射偏移后，是否把.wrapS或.wrapT设置为重复映射模式THREE.RepeatWrapping，两种情况的渲染效果差异。

```javascript
texture.offset.x +=0.5;//纹理U方向偏移
// 设置.wrapS也就是U方向，纹理映射模式(包裹模式)
texture.wrapS = THREE.RepeatWrapping;//对应offste.x偏移

```

### 外部模型材质共享问题

改变一个模型颜色其它模型跟着变化，是因为多个模型对象共享了材质，如果单独改变一个模型的材质，比如颜色，下面两个方案，可以任选其一

1. 三维建模软件中设置，需要代码改变材质的Mesh不要共享材质，要独享材质。
2. 代码批量更改：克隆材质对象，重新赋值给mesh的材质属性


```javascript
//用代码方式解决mesh共享材质问题
gltf.scene.getObjectByName("小区房子").traverse(function (obj) {
    if (obj.isMesh) {
        // .material.clone()返回一个新材质对象，和原来一样，重新赋值给.material属性
        obj.material = obj.material.clone();
    }
});
mesh1.material.color.set(0xffff00);
mesh2.material.color.set(0x00ff00);

```

## 纹理对象Three.Texture的属性

### 纹理的encoding 和 renderer.outputEncoding
如果没有特殊需要，一般为了正常渲染，避免颜色偏差，threejs代码中需要颜色贴图.encoding和渲染器.outputEncoding属性值保持一致。


**纹理对象Texture颜色空间编码属性.encoding**
纹理对象Texture颜色空间 (opens new window)编码属性.encoding有多个属性值，默认值是线性颜色空间THREE.LinearEncoding。

- THREE.LinearEncoding：线性颜色空间
- THREE.sRGBEncoding：sRGB (opens new window)颜色空间

## envMap 和 scene.environment的区别
envMap是材质的环境贴图属性，scene.environment是场景的环境贴图属性，两者的区别在于：
- envMap：只对使用了环境贴图的材质有效，其他材质不受影响。
- scene.environment：对场景中的所有材质有效，所有材质都会受到环境贴图的影响。