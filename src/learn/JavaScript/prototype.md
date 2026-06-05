---
icon: akar-icons:file
date: 2023-12-21
order: 9
category:
  - JavaScript
---

# 原型和原型链

## 什么是原型

原型（Prototype）是 JavaScript 中最核心的概念之一。每个 JavaScript 对象（null 除外）都有一个特殊的属性 —— `__proto__`，这个属性指向另一个对象，这个对象就是「原型」。

原型的作用是：当我们访问一个对象的属性或方法时，如果对象本身没有这个属性或方法，JavaScript 会沿着原型链向上查找，直到找到或者到达原型链顶端（null）。

## 构造函数

构造函数是用于创建对象的特殊函数。通过 `new` 关键字来调用构造函数。

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const person1 = new Person("张三", 25);
const person2 = new Person("李四", 30);

console.log(person1.name); // '张三'
console.log(person2.name); // '李四'
```

## prototype

每个函数都有一个 `prototype` 属性，它是一个对象。当函数作为构造函数使用时（通过 `new` 调用），创建出的对象的原型（`__proto__`）会指向构造函数的 `prototype` 属性。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function () {
  console.log(`Hello, I'm ${this.name}`);
};

const person = new Person("张三");
person.sayHello(); // 'Hello, I'm 张三'
```

在这个例子中，`sayHello` 方法并没有定义在 `person` 对象上，而是定义在 `Person.prototype` 上。通过原型链，`person` 可以访问到 `sayHello` 方法。

## **proto**

`__proto__` 是每个对象（除 null）都具有的属性，它指向创建该对象的构造函数的原型。

```javascript
function Person(name) {
  this.name = name;
}

const person = new Person("张三");

console.log(person.__proto__ === Person.prototype); // true
```

### 获取原型的方法

```javascript
const person = new Person("张三");

Object.getPrototypeOf(person) === Person.prototype; // true (推荐)
person.__proto__ === Person.prototype; // true (历史遗留)
person.constructor.prototype === Person.prototype; // true
```

## 原型链

原型链是由 `__proto__` 属性连接起来的对象链。当访问一个对象的属性时，如果该对象没有这个属性，JavaScript 会沿着原型链向上查找。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log(`Hello, I'm ${this.name}`);
};

const person = new Person("张三");

console.log(person.name); // '张三' (自身属性)
console.log(person.greet()); // 'Hello, I'm 张三' (原型链查找)
console.log(person.toString()); // '[object Object]' (来自 Object.prototype)
console.log(person.valueOf()); // Person { name: '张三' } (来自 Object.prototype)
console.log(person.__proto__ === Person.prototype); // true
console.log(person.__proto__.__proto__ === Object.prototype); // true
console.log(person.__proto__.__proto__.__proto__); // null (原型链顶端)
```

### 原型链图示

```
person 实例
    │
    ├── name: '张三'
    │
    └── __proto__ ──────► Person.prototype
                              │
                              ├── greet: function()
                              │
                              └── __proto__ ──────► Object.prototype
                                                          │
                                                          ├── toString()
                                                          ├── valueOf()
                                                          │
                                                          └── __proto__ ──────► null
```

## constructor

每个原型对象（prototype）都有一个 `constructor` 属性，指向关联的构造函数。

```javascript
function Person(name) {
  this.name = name;
}

console.log(Person.prototype.constructor === Person); // true

const person = new Person("张三");
console.log(person.constructor === Person); // true (通过原型链查找)
```

## 原型继承

原型继承是 JavaScript 中实现继承的主要方式。

### 原型链继承

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function () {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  this.name = name;
  this.breed = breed;
}

// 原型链继承：将子类的原型指向父类的实例
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;

const dog = new Dog("旺财", "金毛");
dog.eat(); // '旺财 is eating'
console.log(dog.breed); // '金毛'
```

::: info
这样的继承会存在以下问题

1. 在创建子类实例的时候，不能向超类型的构造函数中传递参数。
2. 这样创建的子类原型会包含父类的实例属性，造成引用类型属性同步修改的问题。
:::

### 组合继承

组合原型链和构造函数继承的优点。

```javascript
function Animal(name) {
  this.name = name;
  this.colors = ["白色", "黑色"];
}

Animal.prototype.eat = function () {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  Animal.call(this, name); // 构造函数继承
  this.breed = breed;
}

Dog.prototype = new Animal(); // 原型链继承
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function () {
  console.log(`${this.name} is barking`);
};

const dog1 = new Dog("旺财", "金毛");
const dog2 = new Dog("小白", "萨摩耶");

dog1.colors.push("黄色");
console.log(dog1.colors); // ['白色', '黑色', '黄色']
console.log(dog2.colors); // ['白色', '黑色'] (不受影响)
```

:::info
父类的构造函数被调用了两次（创建子类原型时调用了一次，创建子类实例时又调用了一次），导致子类原型上会存在父类实例属性，浪费内存。
:::

### 寄生组合继承

针对组合继承存在的缺陷，又进化出了“寄生组合继承”：使用 Object.create(Parent.prototype) 创建一个新的原型对象赋予子类从而解决组合继承的缺陷：

```js
// 寄生组合继承实现

function Parent(value) {
  this.value = value;
}

Parent.prototype.getValue = function () {
  console.log(this.value);
};

function Child(value) {
  // 调用父类构造函数，初始化子类实例的属性
  Parent.call(this, value);
}

Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false, // 不可枚举该属性
    writable: true, // 可改写该属性
    configurable: true, // 可用 delete 删除该属性
  },
});

const child = new Child(1);
child.getValue();
child instanceof Parent;
```

### ES6 Class 继承

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }

  bark() {
    console.log(`${this.name} is barking`);
  }
}

const dog = new Dog("旺财", "金毛");
dog.eat(); // '旺财 is eating'
dog.bark(); // '旺财 is barking'
```

## 原型相关方法

### Object.create()

创建一个新对象，使用指定对象作为原型。

```javascript
const person = {
  greet() {
    console.log("Hello");
  },
};

const person1 = Object.create(person);
person1.greet(); // 'Hello'

console.log(person1.__proto__ === person); // true
```

### Object.setPrototypeOf()

设置对象的原型（不推荐，影响性能）。

```javascript
const obj = {};
const proto = { greeting: "Hello" };

Object.setPrototypeOf(obj, proto);
console.log(obj.greeting); // 'Hello'
```

### Object.getPrototypeOf() || Reflect.getPrototypeOf()

获取对象的原型。

```javascript
const person = new Person("张三");
console.log(Object.getPrototypeOf(person) === Person.prototype); // true
```

### hasOwnProperty()

检查对象自身是否具有指定属性（不包括原型链）。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.age = 25;

const person = new Person("张三");
console.log(person.hasOwnProperty("name")); // true (自身属性)
console.log(person.hasOwnProperty("age")); // false (原型属性)
```

### in 操作符

检查对象是否具有指定属性（包括原型链）。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.age = 25;

const person = new Person("张三");
console.log("name" in person); // true
console.log("age" in person); // true
```

## 常见面试题

### 1. 原型链顶端是什么？

```javascript
console.log(Object.prototype.__proto__); // null
```

### 2. Object.create(null) 的对象没有原型

```javascript
const obj = Object.create(null);
console.log(obj.__proto__); // undefined
console.log(obj.toString); // undefined
```

### 3. 函数也是对象

```javascript
function fn() {}
console.log(fn.__proto__ === Function.prototype); // true
console.log(fn.prototype); // { constructor: fn }
console.log(fn.__proto__.__proto__ === Object.prototype); // true
```

### 4. 数组的原型链

```javascript
const arr = [1, 2, 3];
console.log(arr.__proto__ === Array.prototype); // true
console.log(arr.__proto__.__proto__ === Object.prototype); // true
console.log(arr.__proto__.__proto__.__proto__); // null
```

### 5. instanceof 原理

`instanceof` 检查构造函数的 `prototype` 属性是否在对象的原型链上。

```javascript
function Person(name) {
  this.name = name;
}

const person = new Person("张三");

console.log(person instanceof Person); // true
console.log(person instanceof Object); // true
console.log(person instanceof Array); // false
```

### 6. new 操作符的实现

```javascript
function myNew(constructor, ...args) {
  const obj = {};
  obj.__proto__ = constructor.prototype;
  const result = constructor.apply(obj, args);
  return typeof result === "object" ? result : obj;
}

function Person(name) {
  this.name = name;
}

const person = myNew(Person, "张三");
console.log(person.name); // '张三'
console.log(person instanceof Person); // true
```

## 总结

1. **每个对象都有 `__proto__` 属性**，指向其构造函数的原型
2. **每个函数都有 `prototype` 属性**，这是创建实例时的原型
3. **原型链**是 JavaScript 实现继承的机制
4. **访问属性时**，先查找自身，如果没有则沿原型链向上查找
5. **Object.prototype** 是所有对象的最终原型（除了 Object.create(null)）
6. **prototype.constructor** 指向构造函数本身

## 原型污染

什么意思呢，原理其实很简单。如果我们把 Object.prototype.toString 改成这样：

```js
Object.prototype.toString = function () {
  alert("原型污染");
};
let obj = {};
obj.toString();
```

解决方式： 代码很简单，只要是碰到有 constructor 或者 **proto** 这样的敏感词汇，就直接退出执行了
