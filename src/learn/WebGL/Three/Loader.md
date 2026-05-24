---
icon: akar-icons:file
date: 2026-05-01
order: 4
category:
  - Three
---

# 各类Loader(加载器)

## GLTFLoader
加载glTF格式的模型文件，glTF是一种开放的3D模型格式，

```javascript
const loader = new GLTFLoader();
```

### 加载方法

```javascript
loader.load( 'gltf模型.gltf', function ( gltf ) {
  console.log('控制台查看加载gltf文件返回的对象结构',gltf);
  console.log('gltf对象场景属性',gltf.scene);
  // 返回的场景对象gltf.scene插入到threejs场景中
  scene.add( gltf.scene );
})

```

## CubeTextureLoader(立方体纹理加载器)

可以用来加载环境贴图

所谓环境贴图，就是一个模型周围的环境的图像，比如一间房子，房子的上下左右前后分别拍摄一张照片，就是3D空间中6个角度方向的照片。

主要作用是为了让物理材质（MeshStandardMaterial）能够正确地反射环境光线，产生更真实的效果。

```javascript
// 加载环境贴图
// 加载周围环境6个方向贴图
// 上下左右前后6张贴图构成一个立方体空间
// 'px.jpg', 'nx.jpg'：x轴正方向、负方向贴图  p:正positive  n:负negative
// 'py.jpg', 'ny.jpg'：y轴贴图
// 'pz.jpg', 'nz.jpg'：z轴贴图
const textureCube = new THREE.CubeTextureLoader()
    .setPath('./环境贴图/环境贴图0/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    // CubeTexture表示立方体纹理对象，父类是纹理对象Texture
```

material.envMapIntensity属性可以控制环境贴图的强度，数值越大，环境贴图的效果越明显。

material.roughness属性可以控制材质的粗糙程度，数值越大，表面越粗糙，反射越模糊；数值越小，表面越光滑，反射越清晰。

material.metalness属性可以控制材质的金属程度，数值越大，表面越像金属，反射越明显；数值越小，表面越像非金属，反射越弱。



