---
icon: akar-icons:file
date: 2026-05-06
order: 6
category:
- Three
---

# stats(性能监视器)

通过 `stats` 可以监视当前的性能指标，主要包括以下几个方面：
- FPS（每秒帧数）：显示当前的帧率，帧率越高，动画越流畅。
- MS（每帧毫秒数）：显示每一帧的渲染时间，数值越小，性能越好。
- MB（内存使用）：显示当前的内存使用情况，数值越小，性能越好。
- Custom（自定义指标）：可以添加自定义的性能指标，例如渲染时间、加载时间等。

```javascript
const stats = new Statas()
document.body.appendChild(stats.domElement)
function render() {
    stats.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}
render()
```