---
icon: akar-icons:file
date: 2026-05-24
order: 2
category:
  - CSS
---

# clip-path

这是一个裁切api，用于裁切元素的显示区域

**常规使用**

`clip-path: polygon(0 0, 100px 0, 100px 100px, 0 100px);`

## inset 矩形

参数：top right bottom left

### 常见使用

- `clip-path: inset(10px);` // 裁切元素的显示区域，裁切10px
- `clip-path: inset(10px 20px 30px 40px);` // 裁切元素的显示区域，裁切上10px 右20px 下30px 左40px
- `clip-path: inset(20% 30% round 10px);` // 裁切元素的显示区域，裁切上20% 右30% 下20% 左20% 并圆角10px

## circle 圆形

- `clip-path: circle(50px at 50% 50%);` // 裁切元素的显示区域，裁切50px半径的圆形，圆心在元素中心
- `clip-path: circle(50px)` // 裁切元素的显示区域，裁切50px半径的圆形，圆心在元素中心
- `clip-path: circle(10% at 2rem 90%)` // 裁切元素的显示区域，裁切10%半径的圆形，圆心在2rem 90% 2rem代表元素的宽度的2倍 90%代表元素的高度的90%
- `clip-path: circle(closest-side at 5rem 6rem)` // 裁切元素的显示区域，裁切最近侧边的圆形，圆心在5rem 6rem 5rem代表元素的宽度的5倍 6rem代表元素的高度的6倍
- `clip-path: circle(farthest-side)` // 裁切元素的显示区域，裁切最远侧边的圆，圆心在元素的中心，半径为元素的宽度或高度的一半

## ellipse 椭圆

- `clip-path: ellipse(20px 50px);` // 裁切元素的显示区域，裁切左右半径为20px, 上下半径为50px
- `clip-path: ellipse(4rem 50% at right center)` // 裁切元素的显示区域，左右半径为4rem 上半径为50% 圆心在元素的右侧中心
- `clip-path: ellipse(10% 20% at 2rem 90%)` // 裁切元素的显示区域，裁切10% 20%的椭圆，圆心在2rem 90% 2rem代表元素的宽度的2倍 90%代表元素的高度的90%

## 案例

### 文字下落出现

```css
@keyframes slideDown {
  0% {
    clip-path: inset(100% 0 0 0);
    transform: translateY(-100%);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}
```

常见问题， 点击事件触发时，元素的显示区域会被裁切，导致点击事件失效
解决方法， 为元素添加 pointer-events: none; 属性
