---
icon: akar-icons:file
date: 2024-11-14
order: 2
category:
  - DevTools
---

# 图片优化方式

## 图片懒加载

### 原生方式

```html
<img src="image.jpg" alt="描述" loading="lazy" />
```

### 使用 IntersectionObserver

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll("img[data-src]").forEach((img) => {
  observer.observe(img);
});
```

## 图片格式优化

使用现代图片格式，例如WebP AVIF 它们提供更改的压缩率

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="描述" />
</picture>
```

## 响应式图片

```html
<img srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
     sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, 1200px"
     src="fallback.jpg" alt="描述">

```

## 通过构建工具压缩图片

以vite为例 通过以下工具包可以实现图片压缩优化

- rollup-plugin-imagemin
- vite-plugin-image-optimizer

## CDN 加速
将图片妨碍CDN 上， 利用分布式服务器网络加速图片加载


## 雪碧图
将多个小图片合并为一个大图片， 通过背景定位显示不同的小图片
```css
.icon {
  background-image: url('sprites.png');
  width: 20px;
  height: 20px;
}
.icon-home {
  background-position: 0 0;
}
.icon-search {
  background-position: -20px 0;
}

```