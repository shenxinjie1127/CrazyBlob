---
icon: akar-icons:file
date: 2026-05-29
order: 2
category:
  - CSS
---

# 选择器

### **通配符选择器 `*`**

```css
* {
  color: red;
}
```

### **元素选择器**

```css
p {
  color: red;
}
```

### **类选择器**

```css
.a {
    color: red;
}
```

### **ID选择器 `#id`**
```css
#id {
    color: red;
}
```

### **属性选择器**
``` html
<ul>
    <li foo>1</li>
    <li foo="abc">2</li>
    <li foo="abc efj">3</li>
    <li foo="abcefj">4</li>
    <li foo="efjabc">5</li>
    <li foo="ab">6</li>
</ul>
```

- [attribute]
```css
[foo] {
    color: red;
}
```
- [attribute="value"]

```css
[attribute="value"] {
    color: red;
}
```
- [attribute^="value"] 以value开头
```css
[attribute^="value"] {
    color: red;
}
```
- [attribute~="value"] 包含value
```css
[attribute~="value"] {
    color: red;
}
```
- [attribute$="value"] 以value结尾
```css
[attribute$="value"] {
    color: red;
}
```

- [attribute*="value"] 包含value
```css
[attribute*="value"] {
    color: red;
}
```
- [attribute|="value"] 以value 开头
```css
[attribute|="value"] {
    color: red;
}
```

### **文档结构选择器**


#### 后代选择器

```css
p li {
    color: red;
}
```

#### 子选择器

```css
p > li {
    color: red;
}
```

#### 相邻兄弟选择器

```css
p + li {
    color: red;
}
```


#### 一般兄弟选择器

```html
<div>
    <h1>h1</h1>
    <p>p1</p>
    <p>p2</p>
    <p>p3</p>
</div>
```
选择前面有 element1 元素的每个 elem 元素。
```css
h1 ~ p {
    color: red;
}
```
### 伪类选择器

- :root 选择根元素
```css
:root {
    color: red;
}
```
- :nth-child() 选择第n个子元素
```css
p:nth-child(2) {
    color: red;
}
```
- :nth-of-type() 选择第n个同类型元素
```css
p:nth-of-type(2) {
    color: red;
}
```
- :first-child 选择第一个子元素
```css
p:first-child {
    color: red;
}
```
- :last-child 选择最后一个子元素
```css
p:last-child {
    color: red;
}
```
- :first-of-type 选择第一个同类型元素
```css
p:first-of-type {
    color: red;
}
```
- :last-of-type 选择最后一个同类型元素
```css
p:last-of-type {
    color: red;
}
```
- :only-child 选择唯一子元素
```css
p:only-child {
    color: red;
}
```
- :empty 选择空元素
```css
p:empty {
    color: red;
}
```

### 伪元素选择器

- ::before 选择元素的伪元素 before
```css
p::before {
    content: "before";
    color: red;
}
```
- ::after 选择元素的伪元素 after
```css
p::after {
    content: "after";
    color: red;
}
```

## 优先级
1. ！important 优先级最高
2. 内联样式 
3. ID 选择器
4. 类 、伪类 、属性选择器
5. 标签 伪元素
6. 通配符
7. 继承的样式

