---
icon: akar-icons:file
date: 2026-05-07
order: 4
category:
- Three
---

# line(线模型)

线材质

```javascript
const material = new THREE.LineBasicMaterial({
    color: 0x0000ff, // 线的颜色
    linewidth: 1, // 线的宽度
});
const line = new THREE.Line(geometry ,material)
```
 
## 闭合线条
如果需要闭合线条，可以使用 `THREE.LineLoop` 来创建线条对象：

```javascript
const lineLoop = new THREE.LineLoop(geometry, material);
```

## 非连续的线条

如果需要创建非连续的线条，可以使用 `THREE.LineSegments` 来创建线条对象：

```javascript
const lineSegments = new THREE.LineSegments(geometry, material);
```