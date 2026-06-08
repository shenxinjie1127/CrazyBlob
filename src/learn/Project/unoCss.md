---
icon: akar-icons:file
date: 2025-08-21
order: 8
category:
  - Utils
---

# UnoCss

UnoCSS 是即时原子 CSS 引擎，其设计灵活且可扩展。核心是不固定的，所有 CSS 工具都是通过预设提供的。

## 配置

### 自定义规则 Rules

**基础配置**

```typescript title="uno.config.ts"
import {defineConfig} from 'unocss'

export default defineConfig({
    rules: [
        ['m-1', {margin: '1px'}],
    ],
})

```

**灵活配置**
你可以通过将规则的第一个参数（我们称之为匹配器）更改为 RegExp，将主体更改为函数，使规则动态化，例如

```typescript
export default defineConfig({
    rules: [
        -['m-1', {margin: '1px'}], // [!code --]
        +[/^m-([\.\d]+)$/, ([_, num]) => ({margin: `${num}px`})], // [!code ++]
    ],
})
```

**规则补丁**
如果你希望利用 CSS 规则回退来使用新的 CSS 功能，同时还能够回退以支持旧浏览器，你可以选择返回一个 2D 数组作为具有相同键的规则的 CSS 表示。例如：

```typescript
rules: [
    [/^h-(\d+)dvh$/, ([_, d]) => {
        return [
            ['height', `${d}vh`],
            ['height', `${d}dvh`],
        ]
    }],
]
```

这将使 `h-100dvh` 生成：

```css
.h-100dvh {
    height: 100vh;
    height: 100dvh;
}
```

**排序**
UnoCSS 尊重你在生成的 CSS 中定义的规则的顺序。后者具有更高的优先级。

当使用动态规则时，它可能会匹配多个标记。默认情况下，在单个动态规则下匹配的输出将在组内按字母顺序排序

**规则合并**
默认情况下，UnoCSS 会将 CSS 规则与同一正文合并，以最小化 CSS 大小。

例如，`<div class="m-2 hover:m2">` 将生成：

```css
.hover\:m2:hover,
.m-2 {
    margin: 0.5rem;
}
```

### 快捷方式 shortcuts

**基础配置**

```typescript title="uno.config.ts"
import {defineConfig} from 'unocss'

export default defineConfig({
    shortcuts: {
        // shortcuts to multiple utilities
        'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md',
        'btn-green': 'text-white bg-green-500 hover:bg-green-700',
        // single utility alias
        'red': 'text-red-100',
    }
})
```

**动态快捷方式**

```typescript
shortcuts: [
    // you could still have object style
    {
        btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
    },
    // dynamic shortcuts
    [/^btn-(.*)$/, ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`],
]
```

这样，我们就可以使用 btn-green 和 btn-red 生成以下 CSS：

```css
.btn-green {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    --un-bg-opacity: 1;
    background-color: rgb(74 222 128 / var(--un-bg-opacity));
    border-radius: 0.5rem;
    --un-text-opacity: 1;
    color: rgb(220 252 231 / var(--un-text-opacity));
}

.btn-red {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    --un-bg-opacity: 1;
    background-color: rgb(248 113 113 / var(--un-bg-opacity));
    border-radius: 0.5rem;
    --un-text-opacity: 1;
    color: rgb(254 226 226 / var(--un-text-opacity));
}
```

### 主题 theme

UnoCSS 还支持你可能在 Tailwind CSS / Windi CSS 中熟悉的主题系统。在用户级别，你可以在配置中指定 theme 属性，它将深度合并到默认主题。

**基础配置**

```typescript
import {defineConfig} from 'unocss'

export default defineConfig({
    theme: {
        // ...
        colors: {
            veryCool: '#0000ff', // class="text-very-cool"
            brand: {
                primary: 'hsl(var(--hue, 217) 78% 51%)', //class="bg-brand-primary"
                DEFAULT: '#942192' //class="bg-brand"
            },
        },
    }
})
```

**rules中使用**

```typescript
rules: [
    [/^text-(.*)$/, ([, c], {theme}) => {
        if (theme.colors[c])
            return {color: theme.colors[c]}
    }],
]
```

**variants（变体）中使用**

```typescript
variants: [
    {
        name: 'variant-name',
        match(matcher, {theme}) {
            // ...
        },
    },
]
```

**shortcuts（快捷方式）中使用**

```typescript
shortcuts: [
    [/^badge-(.*)$/, ([, c], {theme}) => {
        if (Object.keys(theme.colors).includes(c))
            return `bg-${c}4:10 text-${c}5 rounded`
    }],
]
```

**断点**

::: warning
当提供自定义 `breakpoints` 对象时，默认值将被覆盖而不是合并。
:::
通过以下示例，你将只能使用 `sm:` 和 `md:` 断点变体：

```typescript
import {defineConfig} from 'unocss'

export default defineConfig({
    theme: {
        // ...
        breakpoints: {
            sm: '320px',
            md: '640px',
        },
    }
})
```

### 变体（variants）

变体 允许你对现有规则应用一些变体，例如 Tailwind CSS 的 hover: 变体。

**基础配置**

```typescript title="uno.config.ts"
import {defineConfig} from 'unocss'

export default defineConfig({
    variants: [
        // hover:
        (matcher) => {
            if (!matcher.startsWith('hover:'))
                return matcher
            return {
                // slice `hover:` prefix and passed to the next variants and rules
                matcher: matcher.slice(6),
                selector: s => `${s}:hover`,
            }
        },
    ],
    rules: [
        [/^m-(\d)$/, ([, d]) => ({margin: `${d / 4}rem`})],
    ]
})
```

让我们看一下匹配` hover:m-2 `时发生的情况：

```css
.hover\:m-2:hover {
    margin: 0.5rem;
}
```

### 提取器

提取器用于从源代码中提取工具的使用情况

```typescript
import {defineConfig} from 'unocss'

export default defineConfig({
    extractors: [
        // your extractors
    ],
})
```

### 预检

你可以从配置中注入原始 CSS 作为预检。解决后的 theme 可用于自定义 CSS。

```typescript
import {defineConfig} from 'unocss'

export default defineConfig({
    preflights: [
        {
            getCSS: ({theme}) => `
      * {
        color: ${theme.colors.gray?.[700] ?? '#333'};
        padding: 0;
        margin: 0;
      }
    `,
        },
    ]
})
```

### 层

CSS 的顺序会影响它们的优先级。虽然引擎将 保留规则的顺序，但有时你可能希望对一些工具进行分组以对其顺序进行显式控制。

与 Tailwind CSS 提供三个固定图层（base、components、utilities）不同，UnoCSS 允许你根据需要定义图层。要设置图层，你可以将元数据作为规则的第三项传递：

```typescript
import {defineConfig} from 'unocss'

export default defineConfig({
    rules: [
        [/^m-(\d)$/, ([, d]) => ({margin: `${d / 4}rem`}), {layer: 'utilities'}],
        // when you omit the layer, it will be `default`
        ['btn', {padding: '4px'}],
    ]
})
```

**生成**

```css
/* layer: default */
.btn {
    padding: 4px;
}

/* layer: utilities */
.m-2 {
    margin: 0.5rem;
}
```

还可以在每次预检时设置图层：

```typescript
preflights: [
    {
        layer: 'my-layer',
        getCSS: async () => (await fetch('my-style.css')).text(),
    },
]
```

你可以通过以下方式控制图层的顺序：

```typescript
const layers = {
    'components': -1,
    'default': 1,
    'utilities': 2,
    'my-layer': 3,
}
```

### autocomplete

```typescript
export default defineConfig({
    autocomplete: {
        templates: [
            // theme inferring
            'bg-$color/<opacity>',
            // short hands
            'text-<font-size>',
            // logic OR groups
            '(b|border)-(solid|dashed|dotted|double|hidden|none)',
            // constants
            'w-half',
        ],
        shorthands: {
            // equal to `opacity: "(0|10|20|30|40|50|60|70|90|100)"`
            'opacity': Array.from({length: 11}, (_, i) => i * 10),
            'font-size': '(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)',
            // override built-in short hands
            'num': '(0|1|2|3|4|5|6|7|8|9)',
        },
        extractors: [
            // ...extractors
        ],
    }
})
```

### 预设 presets


