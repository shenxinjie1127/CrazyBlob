---
icon: akar-icons:file
date: 2026-05-01
order: 4
category:
  - Three
---


# GLTF(3D模型格式)
GLTF 格式文件几乎可以包含所有的三维模型相关信息的数据，比如模型的层级关系，PBR材质，纹理贴图，骨骼动画，变形动画

## 格式信息

```
{
  "asset": {
    "version": "2.0",
  },
...
// 模型材质信息
  "materials": [
    {
      "pbrMetallicRoughness": {//PBR材质
        "baseColorFactor": [1,1,0,1],
        "metallicFactor": 0.5,//金属度
        "roughnessFactor": 1//粗糙度
      }
    }
  ],
  // 网格模型数据
  "meshes": ...
  // 纹理贴图
  "images": [
        {
            // uri指向外部图像文件
            "uri": "贴图名称.png"//图像数据也可以直接存储在.gltf文件中
        }
   ],
     "buffers": [
    // 一个buffer对应一个二进制数据块，可能是顶点位置 、顶点索引等数据
    {
      "byteLength": 840,
     //这里面的顶点数据，也快成单独以.bin文件的形式存在   
      "uri": "data:application/octet-stream;base64,AAAAPwAAAD8AAAA/AAAAPwAAAD8AAAC/.......
    }
  ],
}

```
## .bin文件

有些glTF文件会关联一个或多个.bin文件，.bin文件以二进制形式存储了模型的顶点数据等信息。 .bin文件中的信息其实就是对应gltf文件中的buffers属性，buffers.bin中的模型数据，可以存储在.gltf文件中,也可以单独一个二进制.bin文件。

## 二进制 glb
gltf格式文件不一定就是以扩展名.gltf结尾，.glb就是gltf格式的二进制文件。比如你可以把.gltf模型和贴图信息全部合成得到一个.glb文件中，.glb文件相对.gltf文件体积更小，网络传输自然更快
