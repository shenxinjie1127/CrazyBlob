---
icon: akar-icons:file
date: 2025-08-21
order: 2
category:
  - Utils
---

# 颜色转化工具

## color

### 下载

::: code-tabs#shell
@tab npm

```bash :no-line-numbers
npm install --save color
```

@tab yarn

```bash :no-line-numbers
yarn add color
```

@tab pnpm

```bash :no-line-numbers
pnpm add color
```

:::

### 使用

```typescript
import Color from "color"
```

#### 构造

```typescript :no-line-numbers
const color = Color('rgb(255, 255, 255)')                       // { model: 'rgb', color: [ 255, 255, 255 ], valpha: 1 }
const color = Color('hsl(194, 53%, 79%)')                       // { model: 'hsl', color: [ 195, 53, 79 ], valpha: 1 }
const color = Color('hsl(194, 53%, 79%, 0.5)')                  // { model: 'hsl', color: [ 195, 53, 79 ], valpha: 0.5 }
const color = Color('#FF0000')                                  // { model: 'rgb', color: [ 255, 0, 0 ], valpha: 1 }
const color = Color('#FF000033')                                // { model: 'rgb', color: [ 255, 0, 0 ], valpha: 0.2 }
const color = Color('lightblue')                                // { model: 'rgb', color: [ 173, 216, 230 ], valpha: 1 }
const color = Color('purple')                                   // { model: 'rgb', color: [ 128, 0, 128 ], valpha: 1 }
```

#### 实践

**颜色转化**
echarts 折线图颜色和阴影颜色

```typescript :no-line-numbers
/**
 * @description 将十六进制颜色转换为RGBA格式
 * @param hex
 * @param alpha 透明度值，范围0-1
 */
export function hexToRgba(hex: string, alpha: number) {
    return Color(hex).rgb().alpha(alpha).toString();
}
```