---
icon: akar-icons:file
date: 2026-05-22
order: 14
category:
  - JavaScript
---

# 类型转化规则

## 原始转化为数字

1. true => 1
2. false => 0
3. null => 0
4. undefine => NaN
5. string
   1. 空字符串（含空白字符）：0
   2. 去掉引号，不是数字就上NaN

## 所有转化为bool

### false

- null => false
- undefined => false
- number 0 => false
- string 空字符串 => false

## 原始转化为字符串

- null => 'null'
- undefined => 'undefined'
- number => 'number'
- true => 'true'
- false => 'false'

## 对象转化为原始

1. 先调用valueOf  
2. 如果得到的是对象 重新调用toString
3. 如果还是对象 就报错

```javascript
[].valueOf() // []
[].toStats() // ''

{}.valueOf() // {}
{}.toString() // '[Object object]'
```

## 运算符

### 算术运算

1. 先要转化为原始类型
2. 判断特殊情况
   - 如果有一个是字符串，那就需要转化为字符串，然后拼接
   - NaN 类型和任何类型运算得到的还是NaN

### 比较运算

#### ’> < >= <=‘
1. 先要转化为原始类型
2. 不是特殊情况的话 ，转成数字直接比较

**特殊情况**

1. 两端全是字符串 比较字典顺序
2. 两端存在NaN 一定为false

## '=='

- 两端类型相同 比较值
- 两端都是原始类型，转换呈数字比较
- 一端是原始类型 一端是对象类型 把对象类型转换呈原始类型后比较
- 特殊情况：undefined 和 null 只有与自身比较或者相互比较时 才会返回true
- 特殊情况： 两端存在NaN 一定为false

### 逻辑运算

需要转化为boolean

#### x&&y
- x为false 返回x
- x为true 返回y

#### x|| y

- x为false 返回y
- x为true 返回x