---
icon: akar-icons:file
date: 2026-06-06
order: 11
category:
  - Utils
---

# 静态资源错误的降级处理

1. 图片 css js 加载失败使用onerror 事件处理
2. 多cdn 兜底方案
3. 全局错误监听 `window.addEventListener("error", (e) => {console.error("全局错误", e);});` 结合埋点上报

## 图片加载失败

- 通过onerror 事件替换图片

```javascript
const img = document.querySelector("img");
img.onerror = function () {
  this.src = "default.jpg";
};
```

## JS/CSS 加载失败

- 动态加载的时候可以处理

```javascript
function loadScript(url, fallbackSrc) {
  const script = document.createElement("script");
  script.src = url;
  script.onerror = function () {
    if (fallbackSrc) {
      const fallbackScript = document.createElement("script");
      fallbackScript.src = fallbackSrc;
      document.head.appendChild(fallbackScript);
    }
  };
  document.head.appendChild(script);
}
```


const newObj  = {}
A.call(newObj, args)
newObj.__proto__ = A.prototype