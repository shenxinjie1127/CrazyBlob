---
icon: akar-icons:file
date: 2024-02-13
order: 3
category:
  - JavaScript
---

# 深浅拷贝

## 数据类型

### 基础类型

- **undefined** 表示不存在定义，声明变量但没有初始化，这个变量的值就是undefined； 注意：在任何一个引用变量值设置为undefined都是错误的
- **null** ，表示一个值被定义了，定义为空值； 使用场景为 定义变量准备在将来用于保存对象；所以引用值可以是null而不会是undefined；

  undefined和null的区别：js诞生的时候只设置了null作为“无”的值。最初的设计是null是表示一个“无”的对象，转为数值时为0； | undefined表示“无”的原始值，转为数值时为NaN；红宝书上说引入undefined就是为了正式的区分空对象指针与未经初始化的变量，变量设置为null就是空对象指针，没有设置就是未经初始化！
- **Boolean**，字面值为true和false
- **number**，字面量格式可以是十进制、八进制（八进制第一位必须是0）、十六进制（前两位必须是0x）
- **String** 由零个或多个16位Unicode字符组成的字符序列
- **symbol**，ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是ES6 引入Symbol的原因

### 引用类型

引用类型统称为object类型，细分的话有：Object 类型、Array 类型、Date 类型、RegExp 类型、Function 类型 等。

## 浅拷贝

浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。

- 如果属性是基本类型，拷贝是就是基本类型是值，
- 如果属性是引用类型，拷贝的就是内存地址，所以如果其中一个对象改变了这个地址，就会影响到另外一个对象。

### 实现方式

- `Object.assign()`
- lodash 的 `_.clone()` 方法
- `...` 运算符
- `Array.prototype.slice()` 方法
- `Array.prototype.concat()` 方法

### 示例

```typescript :no-line-numbers

var person = {
    name: 'sxj',
    hobby: ['1', ['2', '3', '4'], '5']
}

function shallowCopy(obj) {
    var target = {}
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i]
        }

    }
    return target
}

var person1 = shallowCopy(person)
person1.name = 'wyj'   //在浅拷贝中，name属于基本属性，是不会互相影响的
person1.hobby[0] = '9' //在浅拷贝中，数组属于引用对象所以拷贝的是他在内存中的地址，是会互相影响的
console.log(person);
console.log(person1);
//结果就是person和person1的名字不一样 但是hobby数组是一样的并且hobby[0]都变成了‘9’
```

## 深拷贝

深拷贝是将一个对象总内存中**完整**的拷贝出来一份，从堆内存中开辟一个新的区域存放新对象，且修改新对象*不会影响原对象*。

### 实现方式

- `JSON.parse(JSON.stringify())` 像`function` `Date` 都没法拷贝 弊端较多
- 递归的操作
- `Jquery.entend()`
- `lodash` 的 `_.cloneDeep()` 方法

### 示例

```typescript :no-line-numbers
var person = {
    name: 'sxj',
    hobby: ['1', ['2', '3', '4'], '5']
}

function deepClone(obj) {
    var cloneObj = new obj.constructor()
    if (obj === null) return obj //在js中，null是一个对象
    if (obj instanceof Date) return new Date(obj)
    if (obj instanceof RegExp) return new RegExp(obj)
    if (typeof obj !== 'object') return obj
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            cloneObj[i] = deepClone(obj[i])
        }
    }
    return cloneObj
}

var person1 = deepClone(person)
person1.name = 'wyj'
person1.hobby[0] = '9'
console.log(person);
console.log(person1);
```


