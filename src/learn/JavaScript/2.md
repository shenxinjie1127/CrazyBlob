---
icon: akar-icons:file
date: 2024-10-13
order: 2
category:
  - JavaScript
  - 设计模式
---

# 设计模式及场景

## 创建型

### 单例模式

全局只能存在一个实例，并在全局可以访问。
一般用于全局状态的共享和缓存。

```typescript :no-line-numbers
class A {
    static instance?: A

    getInstance() {
        if (A.instance) {
            return A.instance
        } else {
            return new A()
        }
    }
}

```

### 工厂方法模式

不使用new去创建实例， 常用于根据不同的条件(类型)创建不同的对象。

```typescript :no-line-numbers
class Button {
    render() {
        console.log('Rendering a button');
    }
}

class Input {
    render() {
        console.log('Rendering an input');
    }
}

class WidgetFactory {
    static createWidget(type) {
        switch (type) {
            case 'button':
                return new Button();
            case 'input':
                return new Input();
            default:
                throw new Error('Unknown widget type');
        }
    }
}

const button = WidgetFactory.createWidget('button');
button.render();  // Rendering a button
```

### 抽象工厂模式

抽象工厂模式是一种创建型设计模式，它提供一个接口，用于创建一系列相关或相互依赖的对象，而无需指定它们具体的类。

#### 优点

- 解耦：客户端代码与具体产品类解耦，便于扩展。
- 一致性: 确保同一系列的产品一起使用。

#### 使用场景

- 当系统需要独立于产品的创建、组合和表示时。
- 一个系统有多个产品族，而系统只消费其中某一族的产品。

```typescript :no-line-numbers
// 抽象产品
interface Button {
    render(): string;
}

interface TextBox {
    render(): string;
}

// 具体产品
class WinButton implements Button {
    render(): string {
        return "Windows Button";
    }
}

class MacButton implements Button {
    render(): string {
        return "Mac Button";
    }
}

class WinTextBox implements TextBox {
    render(): string {
        return "Windows TextBox";
    }
}

class MacTextBox implements TextBox {
    render(): string {
        return "Mac TextBox";
    }
}

// 抽象工厂
interface GUIFactory {
    createButton(): Button;

    createTextBox(): TextBox;
}

// 具体工厂
class WinFactory implements GUIFactory {
    createButton(): Button {
        return new WinButton();
    }

    createTextBox(): TextBox {
        return new WinTextBox();
    }
}

class MacFactory implements GUIFactory {
    createButton(): Button {
        return new MacButton();
    }

    createTextBox(): TextBox {
        return new MacTextBox();
    }
}

```

### 建造者模式

建造者模式是一种创建型设计模式，它允许使用多个简单的对象一步步构建一个复杂的对象。它将对象的构建与表示分离，使同样的构建过程可以创建不同的表示。

- **产品（Product）**: 需要构建的复杂对象。
- **建造者（Builder）**: 定义创建产品的抽象接口。
- **具体建造者（ConcreteBuilder）**: 实现建造者接口，以构建和装配产品的各个部分。
- **指挥者（Director）**: 负责使用建造者接口来构建产品。

#### 优点

- **分离复杂对象的构建和表示**: 使得构建过程更灵活。
- **代码可读性强**: 清晰分离了构建逻辑和产品表示。

#### 使用场景

- 当构建一个复杂对象的算法应该独立于该对象的组成部分时
- 当构建过程需要多步操作时

```typescript :no-line-numbers
// 产品
class Car {
    public wheels: number = 4;
    public engine: string = '';
    public seats: number = 0;

    public specifications(): string {
        return `Car with ${this.wheels} wheels, ${this.engine} engine and ${this.seats} seats.`;
    }
}

// 建造者接口
interface CarBuilder {
    setEngine(engine: string): this;

    setSeats(seats: number): this;

    build(): Car;
}

// 具体建造者
class SportsCarBuilder implements CarBuilder {
    private car: Car;

    constructor() {
        this.car = new Car();
    }

    setEngine(engine: string): this {
        this.car.engine = engine;
        return this;
    }

    setSeats(seats: number): this {
        this.car.seats = seats;
        return this;
    }

    build(): Car {
        return this.car;
    }
}

// 指挥者
class CarDirector {
    private builder: CarBuilder;

    constructor(builder: CarBuilder) {
        this.builder = builder;
    }

    constructCar(): Car {
        return this.builder.setEngine('V8').setSeats(2).build();
    }
}

// 使用
const builder = new SportsCarBuilder();
const director = new CarDirector(builder);
const car = director.constructCar();
console.log(car.specifications());
```

### 原型模式

原型模式是一种创建型设计模式，通过复制现有的对象来创建新的对象，而不是通过实例化类。这种方式使得对象的创建更加灵活，尤其是在创建成本较高的对象时。

- **原型接口（Prototype）**: 声明一个克隆自身的方法。
- **具体原型（ConcretePrototype）**: 实现克隆方法，返回自身的副本。
- **客户端（Client）**: 使用原型对象来创建新对象。

#### 优点

- **减少创建成本**: 通过复制现有的对象来创建新对象，避免了昂贵的初始化过程。
- **灵活性**: 可以在运行时改变对象的结构和状态。

#### 使用场景

- 当对象的创建成本较高时。
- 当需要通过复制现有对象来实现新对象时。

```typescript :no-line-numbers
// 原型接口
interface Prototype {
    clone(): Prototype;
}

// 具体原型
class ConcretePrototype implements Prototype {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public clone(): Prototype {
        return new ConcretePrototype(this.name);
    }

    public getName(): string {
        return this.name;
    }
}

// 客户端代码
function clientCode() {
    const prototype = new ConcretePrototype("Original");
    const clone = prototype.clone();

    console.log(`Prototype Name: ${prototype.getName()}`);
    console.log(`Cloned Name: ${clone.getName()}`);
}

// 使用
clientCode();
```

## 结构型

### 适配器模式

适配器模式是一种结构型设计模式，通过将一个类的接口转换成客户端所期望的另一种接口，使得原本由于接口不兼容而无法一起工作的类可以协同工作。

- **目标接口（Target）**: 客户端所期待的接口。
- **适配者（Adapter）**: 负责将适配者的接口转换成目标接口。
- **适配者类（Adaptee）**: 需要适配的类，具有与目标接口不兼容的接口。
- **客户端（Client）**: 通过目标接口与适配器交互。

#### 优点

- 提高代码的灵活性和可复用性: 使得不兼容的接口可以一起工作。
- 单一职责原则: 将适配的责任分离到适配器中。

#### 使用场景

- 当希望使用的类的接口与现有代码不兼容时。
- 当需要使用多个不同接口的类时。

```typescript :no-line-numbers

// 目标接口
interface Target {
    request(): string;
}

// 适配者类
class Adaptee {
    public specificRequest(): string {
        return "Specific request from Adaptee.";
    }
}

// 适配器
class Adapter implements Target {
    private adaptee: Adaptee;

    constructor(adaptee: Adaptee) {
        this.adaptee = adaptee;
    }

    public request(): string {
        return this.adaptee.specificRequest();
    }
}

// 客户端代码
function clientCode(target: Target) {
    console.log(target.request());
}

// 使用
const adaptee = new Adaptee();
const adapter = new Adapter(adaptee);
clientCode(adapter);
```

### 装饰器模式

装饰器模式是一种结构型设计模式，它允许在不改变对象自身的情况下，动态地向其添加额外的功能。这个模式通过创建一个装饰类来包裹原有的类，并在保持原有类接口的前提下，提供额外的功能。

- **组件接口（Component）**: 定义了对象的接口。
- **具体组件（ConcreteComponent）**: 实现了组件接口的具体类。
- **装饰器接口（Decorator）**: 继承了组件接口，持有一个组件的引用。
- **具体装饰器（ConcreteDecorator）**: 实现了装饰器接口，添加新的功能。

#### 优点

- **灵活性**: 可以动态添加和撤销功能，而不需要修改类的结构。
- **单一职责原则**: 通过将功能分离到装饰器中，原有类的职责更单一。

#### 使用场景

- 当需要在运行时为对象添加功能时。
- 当希望能够组合多个功能时。

```typescript :no-line-numbers

// 组件接口
interface Coffee {
    cost(): number;

    description(): string;
}

// 具体组件
class SimpleCoffee implements Coffee {
    public cost(): number {
        return 5;
    }

    public description(): string {
        return "Simple coffee";
    }
}

// 装饰器基类
abstract class CoffeeDecorator implements Coffee {
    protected coffee: Coffee;

    constructor(coffee: Coffee) {
        this.coffee = coffee;
    }

    public abstract cost(): number;

    public abstract description(): string;
}

// 具体装饰器
class MilkDecorator extends CoffeeDecorator {
    public cost(): number {
        return this.coffee.cost() + 1; // 添加牛奶的成本
    }

    public description(): string {
        return this.coffee.description() + ", milk"; // 添加牛奶描述
    }
}

class SugarDecorator extends CoffeeDecorator {
    public cost(): number {
        return this.coffee.cost() + 0.5; // 添加糖的成本
    }

    public description(): string {
        return this.coffee.description() + ", sugar"; // 添加糖描述
    }
}

// 使用
function clientCode() {
    let coffee: Coffee = new SimpleCoffee();
    console.log(`${coffee.description()} costs $${coffee.cost()}`);

    coffee = new MilkDecorator(coffee);
    console.log(`${coffee.description()} costs $${coffee.cost()}`);

    coffee = new SugarDecorator(coffee);
    console.log(`${coffee.description()} costs $${coffee.cost()}`);
}

// 执行客户端代码
clientCode();
```

### 代理模式

代理模式是一种结构型设计模式，它为其他对象提供一种代理以控制对这个对象的访问。代理对象可以在客户端与真实对象之间起到中介作用，通常用于延迟加载、权限控制、日志记录等场景。

- **主题接口（Subject）**: 定义了代理和真实对象的共同接口。
- **真实主题（RealSubject）**: 实现了主题接口，代表实际的对象。
- **代理（Proxy）**: 实现了主题接口，持有一个真实主题的引用，并控制对其的访问。

#### 优点

- **控制访问**: 代理可以在访问真实对象前后添加额外的处理逻辑
- **延迟加载**: 可以延迟真实对象的创建，直到需要时才进行实例化
- **增强功能**: 可以在不修改真实对象的情况下增加额外的功能，如日志记录。

#### 使用场景

- 当需要对对象的访问进行控制时。
- 当需要对对象的操作进行额外的处理时。

```typescript :no-line-numbers

// 主题接口
interface Image {
    display(): void;
}

// 真实主题
class RealImage implements Image {
    private filename: string;

    constructor(filename: string) {
        this.filename = filename;
        this.loadImageFromDisk();
    }

    private loadImageFromDisk(): void {
        console.log(`Loading ${this.filename}`);
    }

    public display(): void {
        console.log(`Displaying ${this.filename}`);
    }
}

// 代理
class ProxyImage implements Image {
    private realImage: RealImage | null = null;
    private filename: string;

    constructor(filename: string) {
        this.filename = filename;
    }

    public display(): void {
        if (!this.realImage) {
            this.realImage = new RealImage(this.filename);
        }
        this.realImage.display();
    }
}

// 使用
function clientCode() {
    const image: Image = new ProxyImage("test_image.jpg");

    // 图像将在第一次调用时加载
    image.display();
    // 再次调用时直接显示
    image.display();
}

// 执行客户端代码
clientCode();
```

### 桥接模式

桥接模式是一种结构型设计模式，它旨在将抽象与实现分离，使得两者可以独立变化。通过将抽象部分与实现部分分开，可以在不影响彼此的情况下进行扩展。

- **抽象类（Abstraction）**: 定义抽象部分的接口，并持有一个实现部分的引用。
- **扩展抽象类（RefinedAbstraction）**: 继承自抽象类，扩展了抽象的功能。
- **实现接口（Implementor）**: 定义实现部分的接口。
- **具体实现类（ConcreteImplementor）**: 实现实现接口的具体类。

#### 优点

- **解耦**: 抽象部分和实现部分可以独立变化，减少了耦合。
- **灵活性**: 可以通过组合不同的实现和抽象来扩展功能。

#### 使用场景

- 当需要在抽象和实现之间有多个变化时。
- 当希望避免在同一个类中出现多个变化时。

```typescript :no-line-numbers
// 实现接口
interface Renderer {
    renderCircle(radius: number): void;
}

// 具体实现类
class VectorRenderer implements Renderer {
    public renderCircle(radius: number): void {
        console.log(`Drawing a circle with radius ${radius} using Vector Renderer.`);
    }
}

class RasterRenderer implements Renderer {
    public renderCircle(radius: number): void {
        console.log(`Drawing a circle with radius ${radius} using Raster Renderer.`);
    }
}

// 抽象类
abstract class Shape {
    protected renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    abstract draw(): void;
}

// 扩展抽象类
class Circle extends Shape {
    private radius: number;

    constructor(renderer: Renderer, radius: number) {
        super(renderer);
        this.radius = radius;
    }

    public draw(): void {
        this.renderer.renderCircle(this.radius);
    }
}

// 使用
function clientCode() {
    const vectorRenderer = new VectorRenderer();
    const rasterRenderer = new RasterRenderer();

    const circle1 = new Circle(vectorRenderer, 5);
    const circle2 = new Circle(rasterRenderer, 10);

    circle1.draw(); // 使用向量渲染器
    circle2.draw(); // 使用光栅渲染器
}

// 执行客户端代码
clientCode();
```

### 组合模式

组合模式是一种结构型设计模式，它允许将对象组合成树形结构以表示部分与整体的层次关系。组合模式使得客户端对单个对象和组合对象的使用具有一致性。

- **组件接口（Component）**: 声明了叶子和组合对象的共同接口。
- **叶子（Leaf）**: 实现组件接口的具体类，表示树的叶子节点。
- **组合（Composite）**: 也实现组件接口，持有子组件的引用，可以包含叶子和其他组合。

#### 优点

- **简化客户端代码**: 客户端可以统一处理单个对象和组合对象。
- **灵活性**: 可以动态添加和删除组合中的对象。

#### 使用场景

- 当需要表示树形结构时，如文件系统、组织结构等。
- 当希望客户端可以统一处理单个对象和组合对象时。

```typescript :no-line-numbers
// 组件接口
interface Graphic {
    draw(): void;
}

// 叶子类
class Circle implements Graphic {
    public draw(): void {
        console.log("Drawing a Circle.");
    }
}

class Square implements Graphic {
    public draw(): void {
        console.log("Drawing a Square.");
    }
}

// 组合类
class CompositeGraphic implements Graphic {
    private children: Graphic[] = [];

    public add(graphic: Graphic): void {
        this.children.push(graphic);
    }

    public remove(graphic: Graphic): void {
        const index = this.children.indexOf(graphic);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    public draw(): void {
        console.log("Drawing Composite Graphic:");
        for (const child of this.children) {
            child.draw();
        }
    }
}

// 使用
function clientCode() {
    const circle = new Circle();
    const square = new Square();

    const composite = new CompositeGraphic();
    composite.add(circle);
    composite.add(square);

    // 绘制组合图形
    composite.draw();
}

// 执行客户端代码
clientCode();
```

### 外观模式

外观模式是一种结构型设计模式，它为复杂子系统提供一个简单的接口。通过外观模式，可以将系统中的多个接口封装成一个统一的接口，从而简化客户端的使用。

- **外观类（Facade）**: 提供一个简单的接口，封装了复杂的子系统。
- **子系统类（Subsystem）**: 具体的实现类，提供功能的具体实现。

#### 优点

- **简化接口**: 隐藏了系统的复杂性，提供了一个简单的接口。
- **降低耦合**: 客户端与子系统的依赖关系降低，提高了系统的灵活性。

#### 使用场景

- 当系统有多个复杂的子系统时。
- 当希望为一个复杂的系统提供一个简单的接口时。

```typescript :no-line-numbers
// 子系统类
class CPU {
    public freeze(): void {
        console.log("CPU is freezing.");
    }

    public jump(): void {
        console.log("CPU is jumping to the boot code.");
    }

    public execute(): void {
        console.log("CPU is executing.");
    }
}

class Memory {
    public load(position: number, data: string): void {
        console.log(`Memory: Loading data '${data}' at position ${position}.`);
    }
}

class HardDrive {
    public read(position: number, size: number): string {
        return `Data from position ${position} with size ${size}`;
    }
}

// 外观类
class Computer {
    private cpu: CPU;
    private memory: Memory;
    private hardDrive: HardDrive;

    constructor() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }

    public start(): void {
        this.cpu.freeze();
        this.memory.load(0, this.hardDrive.read(0, 1024));
        this.cpu.jump();
        this.cpu.execute();
    }
}

// 使用
function clientCode() {
    const computer = new Computer();
    computer.start(); // 启动计算机
}

// 执行客户端代码
clientCode();

```

### 享元模式

享元模式是一种结构型设计模式，它通过共享对象来有效地支持大量细粒度的对象。享元模式主要用于减少内存使用和提高性能，适用于需要创建大量相似对象的场景。

- **享元接口（Flyweight）**: 定义了享元对象的接口。
- **具体享元（ConcreteFlyweight）**: 实现了享元接口，具体的共享对象。
- **享元工厂（FlyweightFactory）**: 管理享元对象的创建和共享，确保享元对象的复用。

#### 优点

- **节约内存**: 通过共享相同的对象，减少内存占用。
- **提高性能**: 降低了对象创建的开销。

#### 使用场景

- 当应用程序需要大量的相似对象时。
- 当对象的状态可以被分为内部状态和外部状态时。

```typescript :no-line-numbers
// 享元接口
interface TreeType {
    display(color: string): void;
}

// 具体享元
class ConcreteTreeType implements TreeType {
    private type: string;

    constructor(type: string) {
        this.type = type;
    }

    public display(color: string): void {
        console.log(`Tree Type: ${this.type}, Color: ${color}`);
    }
}

// 享元工厂
class TreeTypeFactory {
    private treeTypes: { [key: string]: TreeType } = {};

    public getTreeType(type: string): TreeType {
        if (!this.treeTypes[type]) {
            this.treeTypes[type] = new ConcreteTreeType(type);
        }
        return this.treeTypes[type];
    }
}

// 使用
function clientCode() {
    const factory = new TreeTypeFactory();

    const tree1 = factory.getTreeType("Oak");
    const tree2 = factory.getTreeType("Pine");
    const tree3 = factory.getTreeType("Oak"); // 复用已有的对象

    tree1.display("Green");
    tree2.display("Brown");
    tree3.display("Dark Green");

    console.log("Are tree1 and tree3 the same object?", tree1 === tree3); // true
}

// 执行客户端代码
clientCode();
```

## 行为型

### 策略模式

策略模式是一种行为型设计模式，它定义了一系列算法，将每个算法封装起来，并使它们可以互相替换。策略模式使得算法的变化独立于使用算法的客户。

- **策略接口（Strategy）**: 定义了所有支持的算法的公共接口。
- **具体策略（ConcreteStrategy）**: 实现了策略接口的具体算法。
- **上下文（Context）**: 持有对策略对象的引用，负责调用策略的方法。

#### 优点

- **灵活性**: 可以在运行时选择算法，增加新的策略时不需要修改客户端代码。
- **封装性**: 将不同的算法封装在不同的策略类中，符合单一职责原则。

#### 使用场景

- 当有多个算法可以完成同一任务时。
- 当希望在运行时动态选择算法时。

```typescript :no-line-numbers
// 策略接口
interface PaymentStrategy {
    pay(amount: number): void;
}

// 具体策略
class CreditCardPayment implements PaymentStrategy {
    public pay(amount: number): void {
        console.log(`Paid ${amount} using Credit Card.`);
    }
}

class PayPalPayment implements PaymentStrategy {
    public pay(amount: number): void {
        console.log(`Paid ${amount} using PayPal.`);
    }
}

// 上下文
class ShoppingCart {
    private paymentStrategy: PaymentStrategy;

    public setPaymentStrategy(strategy: PaymentStrategy): void {
        this.paymentStrategy = strategy;
    }

    public checkout(amount: number): void {
        this.paymentStrategy.pay(amount);
    }
}

// 使用
function clientCode() {
    const cart = new ShoppingCart();

    cart.setPaymentStrategy(new CreditCardPayment());
    cart.checkout(100); // 使用信用卡支付

    cart.setPaymentStrategy(new PayPalPayment());
    cart.checkout(200); // 使用 PayPal 支付
}

// 执行客户端代码
clientCode();
```

### 模板方法模式

模板方法模式是一种行为型设计模式，它定义了一个算法的骨架，并将一些步骤的实现延迟到子类中。模板方法使得子类可以在不改变算法结构的情况下，重新定义算法的某些特定步骤。

- **抽象类（AbstractClass）**: 定义了模板方法和一些抽象步骤。
- **具体类（ConcreteClass）**: 实现了抽象类中的具体步骤。

#### 优点

- **代码复用**: 通过抽象类提供通用的算法结构，减少代码重复。
- **控制流程**: 可以控制算法的执行流程，确保某些步骤的执行顺序。

#### 使用场景

- 当有多个类的算法结构相同时，但实现细节有所不同。
- 当需要控制算法的执行顺序时。

```typescript :no-line-numbers

// 抽象类
abstract class DataProcessor {
    // 模板方法
    public process(): void {
        this.readData();
        this.processData();
        this.saveData();
    }

    protected abstract readData(): void;

    protected abstract processData(): void;

    protected saveData(): void {
        console.log("Data saved.");
    }
}

// 具体类
class CSVDataProcessor extends DataProcessor {
    protected readData(): void {
        console.log("Reading data from CSV file.");
    }

    protected processData(): void {
        console.log("Processing CSV data.");
    }
}

class JSONDataProcessor extends DataProcessor {
    protected readData(): void {
        console.log("Reading data from JSON file.");
    }

    protected processData(): void {
        console.log("Processing JSON data.");
    }
}

// 使用
function clientCode() {
    const csvProcessor = new CSVDataProcessor();
    csvProcessor.process(); // 处理 CSV 数据

    const jsonProcessor = new JSONDataProcessor();
    jsonProcessor.process(); // 处理 JSON 数据
}

// 执行客户端代码
clientCode();
```

### 观察者模式

观察者模式是一种行为型设计模式，它定义了一种一对多的依赖关系，使得当一个对象（主题）状态发生变化时，所有依赖于它的对象（观察者）都得到通知并自动更新。

- **主题接口（Subject）**: 定义添加、删除观察者的方法和通知观察者的方法。
- **具体主题（ConcreteSubject）**: 实现主题接口，维护观察者的列表并在状态变化时通知观察者。
- **观察者接口（Observer）**: 定义更新方法，以便在主题状态变化时被调用。
- **具体观察者（ConcreteObserver）**: 实现观察者接口，处理主题状态变化的逻辑。

#### 优点

- **解耦**: 观察者与主题之间的耦合度低，便于扩展和维护。
- **动态订阅**: 观察者可以在运行时动态添加或移除。

#### 使用场景

- 当一个对象的状态改变需要通知其他对象时。
- 当希望实现广播通信时。

```typescript :no-line-numbers
// 观察者接口
interface Observer {
    update(data: string): void;
}

// 主题接口
interface Subject {
    attach(observer: Observer): void;

    detach(observer: Observer): void;

    notify(): void;
}

// 具体主题
class NewsAgency implements Subject {
    private observers: Observer[] = [];
    private news: string = '';

    public attach(observer: Observer): void {
        this.observers.push(observer);
    }

    public detach(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    public notify(): void {
        for (const observer of this.observers) {
            observer.update(this.news);
        }
    }

    public setNews(news: string): void {
        this.news = news;
        this.notify(); // 通知所有观察者
    }
}

// 具体观察者
class NewsChannel implements Observer {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public update(data: string): void {
        console.log(`${this.name} received news: ${data}`);
    }
}

// 使用
function clientCode() {
    const newsAgency = new NewsAgency();

    const channel1 = new NewsChannel("Channel 1");
    const channel2 = new NewsChannel("Channel 2");

    newsAgency.attach(channel1);
    newsAgency.attach(channel2);

    newsAgency.setNews("Breaking news: Observer pattern implemented!"); // 更新新闻
}

// 执行客户端代码
clientCode();
```

### 发布订阅模式

发布-订阅模式是一种消息通信模式，它允许多个发布者发送消息，而多个订阅者可以接收这些消息。发布者和订阅者之间通过一个中介（通常称为事件总线或消息代理）进行解耦，避免了直接的依赖关系。

- **发布者（Publisher）**: 负责发送消息的对象。
- **订阅者（Subscriber）**: 负责接收消息的对象。
- **事件总线（EventBus 或 Message Broker）**: 负责管理发布者和订阅者之间的关系，并转发消息。

#### 优点

- **解耦**: 发布者和订阅者之间没有直接依赖关系，便于扩展和维护。
- **灵活性**: 可以动态添加或移除订阅者，支持多对多的通信。

#### 使用场景

- 当需要实现事件驱动的架构时。
- 当希望在系统中实现松耦合的消息传递时。

```typescript :no-line-numbers
// 事件总线
class EventBus {
    private subscribers: { [key: string]: Function[] } = {};

    public subscribe(event: string, callback: Function): void {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
    }

    public unsubscribe(event: string, callback: Function): void {
        if (!this.subscribers[event]) return;

        this.subscribers[event] = this.subscribers[event].filter(
            subscriber => subscriber !== callback
        );
    }

    public publish(event: string, data: any): void {
        if (!this.subscribers[event]) return;

        for (const subscriber of this.subscribers[event]) {
            subscriber(data);
        }
    }
}

// 使用
function clientCode() {
    const eventBus = new EventBus();

    const logData = (data: any) => {
        console.log(`Received data: ${data}`);
    };

    eventBus.subscribe('dataReceived', logData);

    eventBus.publish('dataReceived', {message: 'Hello, World!'}); // 发送消息

    eventBus.unsubscribe('dataReceived', logData); // 取消订阅

    eventBus.publish('dataReceived', {message: 'This will not be logged.'}); // 不会触发
}

// 执行客户端代码
clientCode();
```

### 迭代器模式

迭代器模式是一种行为型设计模式，它提供一种方法来顺序访问一个集合对象中的元素，而不暴露该对象的内部表示。迭代器模式使得集合的遍历与集合的实现相分离。

- **迭代器接口（Iterator）**: 定义了访问和遍历集合的接口。
- **具体迭代器（ConcreteIterator）**: 实现了迭代器接口，维护遍历的状态。
- **聚合接口（Aggregate）**: 定义了创建迭代器的方法。
- **具体聚合（ConcreteAggregate）**: 实现了聚合接口，返回具体的迭代器实例。

#### 优点

- **分离关注点**: 迭代器与集合的实现分开，方便维护和扩展。
- **支持多种遍历方式**: 可以实现不同的迭代器以支持不同的遍历方式。

#### 使用场景

- 当需要访问集合的元素但不想暴露集合的内部结构时。
- 当希望提供多种遍历方式时。

```typescript :no-line-numbers
// 迭代器接口
interface Iterator<T> {
    next(): T | null;

    hasNext(): boolean;
}

// 聚合接口
interface Aggregate<T> {
    createIterator(): Iterator<T>;
}

// 具体迭代器
class ConcreteIterator<T> implements Iterator<T> {
    private collection: ConcreteAggregate<T>;
    private index: number = 0;

    constructor(collection: ConcreteAggregate<T>) {
        this.collection = collection;
    }

    public next(): T | null {
        if (this.hasNext()) {
            return this.collection.getItem(this.index++);
        }
        return null;
    }

    public hasNext(): boolean {
        return this.index < this.collection.size();
    }
}

// 具体聚合
class ConcreteAggregate<T> implements Aggregate<T> {
    private items: T[] = [];

    public add(item: T): void {
        this.items.push(item);
    }

    public getItem(index: number): T {
        return this.items[index];
    }

    public size(): number {
        return this.items.length;
    }

    public createIterator(): Iterator<T> {
        return new ConcreteIterator<T>(this);
    }
}

// 使用
function clientCode() {
    const aggregate = new ConcreteAggregate<number>();

    aggregate.add(1);
    aggregate.add(2);
    aggregate.add(3);

    const iterator = aggregate.createIterator();

    while (iterator.hasNext()) {
        console.log(iterator.next());
    }
}

// 执行客户端代码
clientCode();
```

### 职责链模式

职责链模式是一种行为型设计模式，它通过将请求沿着处理链传递，直到有一个对象处理该请求。职责链模式可以将请求的发送者和接收者解耦，使得请求的处理更加灵活。

- **抽象处理者（Handler）**: 定义处理请求的接口，并持有下一个处理者的引用。
- **具体处理者（ConcreteHandler）**: 实现抽象处理者的接口，处理请求或将其传递给下一个处理者。
- **客户端（Client）**: 发起请求的对象。

#### 优点

- **解耦**: 请求的发送者与具体处理者之间没有直接依赖关系。
- **灵活性**: 可以动态添加和修改处理链的结构。

#### 使用场景

- 当有多个对象可以处理请求，但具体处理者在运行时不确定时。
- 当希望以不同的方式处理请求时。

```typescript
// 抽象处理者
abstract class Handler {
    protected nextHandler: Handler | null = null;

    public setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }

    public handleRequest(request: string): void {
        if (this.nextHandler) {
            this.nextHandler.handleRequest(request);
        } else {
            console.log(`No handler for request: ${request}`);
        }
    }
}

// 具体处理者
class ConcreteHandlerA extends Handler {
    public handleRequest(request: string): void {
        if (request === 'A') {
            console.log("Handler A processing request A.");
        } else {
            super.handleRequest(request);
        }
    }
}

class ConcreteHandlerB extends Handler {
    public handleRequest(request: string): void {
        if (request === 'B') {
            console.log("Handler B processing request B.");
        } else {
            super.handleRequest(request);
        }
    }
}

// 使用
function clientCode() {
    const handlerA = new ConcreteHandlerA();
    const handlerB = new ConcreteHandlerB();

    handlerA.setNext(handlerB);

    handlerA.handleRequest('A'); // 处理 A 的请求
    handlerA.handleRequest('B'); // 处理 B 的请求
    handlerA.handleRequest('C'); // 没有处理者处理
}

// 执行客户端代码
clientCode();
```

### 命令模式

命令模式是一种行为型设计模式，它将请求封装为对象，从而使您可以使用不同的请求、排队请求或记录请求，以及支持可撤销的操作。命令模式使得请求的发送者与接收者之间解耦。

- **命令接口（Command）**: 定义执行命令的接口。
- **具体命令（ConcreteCommand）**: 实现命令接口，定义与接收者之间的绑定。
- **接收者（Receiver）**: 处理执行请求的具体逻辑。
- **调用者（Invoker）**: 请求的发起者，持有命令对象并调用命令的执行方法。
- **客户端（Client）**: 创建具体命令对象并指定接收者。

#### 优点

- **解耦**: 请求的发送者与接收者之间没有直接的依赖关系。
- **扩展性**: 可以很容易地添加新命令，而无需修改现有代码。
- **可撤销操作**: 可以实现操作的撤销和重做功能。

#### 使用场景

- 当需要将请求参数化时。
- 当需要支持撤销和重做操作时。
- 当希望使用队列或日志来请求操作时。

```typescript :no-line-numbers
// 命令接口
interface Command {
    execute(): void;

    undo(): void;
}

// 接收者
class Light {
    public turnOn(): void {
        console.log("The light is on.");
    }

    public turnOff(): void {
        console.log("The light is off.");
    }
}

// 具体命令
class TurnOnLightCommand implements Command {
    private light: Light;

    constructor(light: Light) {
        this.light = light;
    }

    public execute(): void {
        this.light.turnOn();
    }

    public undo(): void {
        this.light.turnOff();
    }
}

class TurnOffLightCommand implements Command {
    private light: Light;

    constructor(light: Light) {
        this.light = light;
    }

    public execute(): void {
        this.light.turnOff();
    }

    public undo(): void {
        this.light.turnOn();
    }
}

// 调用者
class RemoteControl {
    private command: Command | null = null;

    public setCommand(command: Command): void {
        this.command = command;
    }

    public pressButton(): void {
        if (this.command) {
            this.command.execute();
        }
    }

    public pressUndo(): void {
        if (this.command) {
            this.command.undo();
        }
    }
}

// 使用
function clientCode() {
    const light = new Light();
    const turnOn = new TurnOnLightCommand(light);
    const turnOff = new TurnOffLightCommand(light);

    const remote = new RemoteControl();

    // 打开灯
    remote.setCommand(turnOn);
    remote.pressButton();

    // 关闭灯
    remote.setCommand(turnOff);
    remote.pressButton();

    // 撤销操作
    remote.pressUndo();
}

// 执行客户端代码
clientCode();
```

### 备忘录模式

备忘录模式是一种行为型设计模式，它允许在不暴露对象实现细节的情况下，保存和恢复对象的状态。该模式使得对象能够恢复到之前的状态，实现撤销和重做操作。

- **备忘录（Memento）**: 存储对象的内部状态的类。
- **发起人（Originator）**: 负责创建备忘录和恢复状态的对象。
- **管理员（Caretaker）**: 管理备忘录的对象，负责保存和恢复备忘录。

#### 优点

- **封装性**: 备忘录模式不暴露对象的内部状态。
- **灵活性**: 可以在需要时恢复对象的状态。

#### 使用场景

- 当需要在对象状态变化时保存状态，以便后续恢复。
- 当需要实现撤销和重做功能时。

```typescript :no-line-numbers
// 备忘录
class Memento {
    private state: string;

    constructor(state: string) {
        this.state = state;
    }

    public getState(): string {
        return this.state;
    }
}

// 发起人
class Originator {
    private state: string;

    public setState(state: string): void {
        this.state = state;
        console.log(`Originator: Setting state to ${state}`);
    }

    public saveState(): Memento {
        console.log(`Originator: Saving state to Memento`);
        return new Memento(this.state);
    }

    public restoreState(memento: Memento): void {
        this.state = memento.getState();
        console.log(`Originator: State after restoring from Memento: ${this.state}`);
    }
}

// 管理员
class Caretaker {
    private mementos: Memento[] = [];

    public addMemento(memento: Memento): void {
        this.mementos.push(memento);
    }

    public getMemento(index: number): Memento {
        return this.mementos[index];
    }
}

// 使用
function clientCode() {
    const originator = new Originator();
    const caretaker = new Caretaker();

    originator.setState('State 1');
    caretaker.addMemento(originator.saveState()); // 保存状态

    originator.setState('State 2');
    caretaker.addMemento(originator.saveState()); // 保存状态

    originator.setState('State 3');

    // 恢复到之前的状态
    originator.restoreState(caretaker.getMemento(1)); // 恢复到 State 2
}

// 执行客户端代码
clientCode();
```

### 状态模式

状态模式是一种行为型设计模式，它允许一个对象在其内部状态改变时改变其行为。状态模式将状态的行为封装在独立的状态类中，使得对象可以在不同状态下表现出不同的行为。

- **状态接口（State）**: 定义了与状态相关的行为接口。
- **具体状态（ConcreteState）**: 实现状态接口，定义具体的状态行为。
- **上下文（Context）**: 持有一个状态对象，并在其状态改变时委托状态对象来处理请求。

#### 优点

- **封装状态**: 将状态相关的行为封装在状态类中，简化上下文类。
- **易于扩展**: 可以通过添加新状态类来扩展新的行为，而无需修改现有代码。

#### 使用场景

- 当一个对象的行为依赖于其状态，并且其状态在运行时会改变时。
- 当需要在多个状态之间切换时。

```typescript :no-line-numbers
// 状态接口
interface State {
    handle(context: Context): void;
}

// 上下文
class Context {
    private state: State;

    constructor(state: State) {
        this.state = state;
    }

    public setState(state: State): void {
        this.state = state;
    }

    public request(): void {
        this.state.handle(this); // 委托请求给当前状态
    }
}

// 具体状态 A
class ConcreteStateA implements State {
    public handle(context: Context): void {
        console.log("Handling request in State A.");
        context.setState(new ConcreteStateB()); // 切换到状态 B
    }
}

// 具体状态 B
class ConcreteStateB implements State {
    public handle(context: Context): void {
        console.log("Handling request in State B.");
        context.setState(new ConcreteStateA()); // 切换到状态 A
    }
}

// 使用
function clientCode() {
    const context = new Context(new ConcreteStateA());

    context.request(); // 处理请求并切换到状态 B
    context.request(); // 处理请求并切换到状态 A
    context.request(); // 处理请求并切换到状态 B
}

// 执行客户端代码
clientCode();
```

### 访问者模式

访问者模式是一种行为型设计模式，它允许在不改变对象结构的前提下，定义新的操作。通过将这些操作封装在访问者对象中，访问者模式使得可以对一组对象进行操作，而不需要修改这些对象的类。

- **访问者接口（Visitor）**: 定义对每个具体元素类的访问操作。
- **具体访问者（ConcreteVisitor）**: 实现访问者接口，定义具体的操作。
- **元素接口（Element）**: 定义接受访问者的方法。
- **具体元素（ConcreteElement）**: 实现元素接口，定义具体的元素数据。
- **对象结构（ObjectStructure）**: 维护一个元素集合，并可以遍历这些元素。

#### 优点

- **灵活性**: 可以在不修改元素类的情况下添加新操作。
- **集中性**: 将操作集中在访问者中，避免了在各个元素中重复实现。

#### 使用场景

- 当需要对一组对象进行多种不同操作时。
- 当需要在不改变对象结构的情况下，增加新的操作时。

```typescript :no-line-numbers
// 访问者接口
interface Visitor {
    visitConcreteElementA(element: ConcreteElementA): void;

    visitConcreteElementB(element: ConcreteElementB): void;
}

// 元素接口
interface Element1 {
    accept(visitor: Visitor): void;
}

// 具体元素 A
class ConcreteElementA implements Element1 {
    public accept(visitor: Visitor): void {
        visitor.visitConcreteElementA(this);
    }

    public operationA(): string {
        return "ConcreteElementA";
    }
}

// 具体元素 B
class ConcreteElementB implements Element1 {
    public accept(visitor: Visitor): void {
        visitor.visitConcreteElementB(this);
    }

    public operationB(): string {
        return "ConcreteElementB";
    }
}

// 具体访问者
class ConcreteVisitor implements Visitor {
    public visitConcreteElementA(element: ConcreteElementA): void {
        console.log(`Visited ${element.operationA()}`);
    }

    public visitConcreteElementB(element: ConcreteElementB): void {
        console.log(`Visited ${element.operationB()}`);
    }
}

// 对象结构
class ObjectStructure {
    private elements: Element[] = [];

    public add(element: Element): void {
        this.elements.push(element);
    }

    public accept(visitor: Visitor): void {
        for (const element of this.elements) {
            element.accept(visitor);
        }
    }
}

// 使用
function clientCode() {
    const objectStructure = new ObjectStructure();
    objectStructure.add(new ConcreteElementA());
    objectStructure.add(new ConcreteElementB());

    const visitor = new ConcreteVisitor();
    objectStructure.accept(visitor); // 访问所有元素
}

// 执行客户端代码
clientCode();
```

### 中介者模式

中介者模式是一种行为型设计模式，它通过定义一个中介对象来封装一系列对象之间的交互，使得对象之间不直接通信，而是通过中介者进行交互。这有助于降低对象之间的耦合度，提高系统的灵活性和可维护性。

- **中介者接口（Mediator）**: 定义了与各个同事对象的交互接口。
- **具体中介者（ConcreteMediator）**: 实现中介者接口，协调各个同事对象的交互。
- **同事接口（Colleague）**: 定义同事对象的接口。
- **具体同事（ConcreteColleague）**: 实现同事接口，包含中介者的引用并通过中介者与其他同事交互。

#### 优点

- **降低耦合**: 同事对象之间不直接通信，减少了依赖关系。
- **集中控制**: 所有交互逻辑集中在中介者中，易于管理和扩展。

#### 使用场景

- 当一个系统中对象之间存在复杂的交互关系时。
- 当希望通过一个中介对象来简化对象间的通信时。

```typescript :no-line-numbers
// 中介者接口
interface Mediator {
    send(message: string, colleague: Colleague): void;
}

// 同事接口
abstract class Colleague {
    protected mediator: Mediator;

    constructor(mediator: Mediator) {
        this.mediator = mediator;
    }

    public abstract receive(message: string): void;
}

// 具体同事 A
class ConcreteColleagueA extends Colleague {
    public send(message: string): void {
        console.log(`Colleague A sending: ${message}`);
        this.mediator.send(message, this);
    }

    public receive(message: string): void {
        console.log(`Colleague A received: ${message}`);
    }
}

// 具体同事 B
class ConcreteColleagueB extends Colleague {
    public send(message: string): void {
        console.log(`Colleague B sending: ${message}`);
        this.mediator.send(message, this);
    }

    public receive(message: string): void {
        console.log(`Colleague B received: ${message}`);
    }
}

// 具体中介者
class ConcreteMediator implements Mediator {
    private colleagueA: ConcreteColleagueA;
    private colleagueB: ConcreteColleagueB;

    constructor(colleagueA: ConcreteColleagueA, colleagueB: ConcreteColleagueB) {
        this.colleagueA = colleagueA;
        this.colleagueB = colleagueB;
    }

    public send(message: string, colleague: Colleague): void {
        if (colleague === this.colleagueA) {
            this.colleagueB.receive(message);
        } else if (colleague === this.colleagueB) {
            this.colleagueA.receive(message);
        }
    }
}

// 使用
function clientCode() {
    const colleagueA = new ConcreteColleagueA(null);
    const colleagueB = new ConcreteColleagueB(null);
    const mediator = new ConcreteMediator(colleagueA, colleagueB);

    // 设置中介者
    colleagueA.mediator = mediator;
    colleagueB.mediator = mediator;

    // 发送消息
    colleagueA.send("Hello, B!");
    colleagueB.send("Hello, A!");
}

// 执行客户端代码
clientCode();
```

### 解释器模式

解释器模式是一种行为型设计模式，它提供了一个语言的文法表示，并定义了该语言的解释器。通过使用解释器模式，可以为特定的语法构建解析和执行机制。

- **抽象表达式（Expression）**: 定义解释操作的接口。
- **终结符表达式（TerminalExpression）**: 实现抽象表达式接口，代表文法中的终结符。
- **非终结符表达式（NonTerminalExpression）**: 实现抽象表达式接口，代表文法中的非终结符。
- **上下文（Context）**: 存储解释所需的全局信息。

#### 优点

- **灵活性**: 可以通过组合不同的表达式来扩展文法。
- **清晰性**: 使文法和解释逻辑分开，便于理解和维护。

#### 使用场景

- 当需要定义一种语言的文法，并需要解释其句子时。
- 当需要设计一个简单的语言或表达式计算器时。

```typescript :no-line-numbers

// 抽象表达式
interface Expression {
    interpret(context: Context): boolean;
}

// 上下文
class Context {
    private data: { [key: string]: boolean } = {};

    public set(key: string, value: boolean): void {
        this.data[key] = value;
    }

    public get(key: string): boolean {
        return this.data[key];
    }
}

// 终结符表达式
class TerminalExpression implements Expression {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    public interpret(context: Context): boolean {
        return context.get(this.key);
    }
}

// 非终结符表达式
class OrExpression implements Expression {
    private expr1: Expression;
    private expr2: Expression;

    constructor(expr1: Expression, expr2: Expression) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }

    public interpret(context: Context): boolean {
        return this.expr1.interpret(context) || this.expr2.interpret(context);
    }
}

// 使用
function clientCode() {
    const context = new Context();
    context.set("A", true);
    context.set("B", false);

    const expression = new OrExpression(new TerminalExpression("A"), new TerminalExpression("B"));

    console.log(`Result: ${expression.interpret(context)}`); // 输出: Result: true
}

// 执行客户端代码
clientCode();
```
