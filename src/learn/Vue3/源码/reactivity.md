---
icon: akar-icons:file
date: 2025-03-01
order: 1
category:
  - Vue3
---

# 响应式原理核心 reactive


`reactive` 其本质是创建一个响应式的代理对象

**核心点**

1. 必须是一个对象
2. 为代理过的对象在代理的时候需要打上一个代理标记`ReactiveFlags.IS_REACTIVE`
3. 所有代理过的对象都要被记录在`reactiveMap`中，方便后续取用
4. 最关键的步骤 `new Proxy`

```ts
export function reactive(target: Object) {
    return createReactiveObject(target);
}

function createReactiveObject(target: Object) {
    // 统一做判断， 响应式对象必须是对象
    if (!isObject(target)) {
        return target;
    }

    // 如果目标对象已经代理过了，直接返回代理后的结果
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target;
    }
    // 如果目标对象已经代理过了，直接返回代理后的结果
    if (reactiveMap.has(target)) {
        return reactiveMap.get(target);
    }
    const proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    return proxy;
}
```

## mutableHandlers

这是响应式中最核心的代理方法

**为什么使用Reflect**

用 Reflect.get(target, key, receiver) 时，receiver 可以保证 getter 里的 this 指向正确的代理对象

Reflect 用来执行对象的默认行为。它可以保证 get/set/delete 等操作符合 JS 标准语义，尤其能正确处理原型链、this 绑定和返回值

**核心：**

1. 使用Reflect操作对象
2. 递归代理对象
3. 调用track收集依赖
4. 调用trigger触发依赖影响

```ts
// proxy 需要搭配 reflect 来使用
export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        // const person = {
        // name: ''
        // get alis() {
        // return this.name
        // }
        //   }
        // 如果使用 target[key] 来取值 只能收集一次依赖 如果这个属性内部还有依赖的值将无法被成功收集，如果用receiver 会被无限收集
        // 当取值的时候， 应该让响应式属性和effect映射起来
        // 依赖收集
        track(target, key);
        const res = Reflect.get(target, key, receiver);
        if (isObject(res)) {
            // 如果是对象， 则需要递归处理
            return reactive(res);
        }
        return res;
    },
    set(target, key, value, receiver) {
        // 找到属性，让对应的EFFECT执行
        // 触发收集依赖
        let oldValue = target[key];
        let result = Reflect.set(target, key, value, receiver);
        if (oldValue !== value) {
            trigger(target, key, value, oldValue);
        }
        return result;
    },
};

```

## track & trigger

track是依赖收集的方法

**关键点**
1. 全局的targetMap 存放所有的依赖关系
2. 每次收集过程中需要有一个activeEffect 便于判断当前正在收集那个effect 并且在嵌套Effect中，需要记录上一次收集的是哪个effect 以便以处理嵌套effect 的关系
2. 每个对象在target中的结构
```
 obj 
    - key 
     - ReactiveEffect -> _trackId
     - ReactiveEffect -> _trackId
     - ReactiveEffect -> _trackId
    - key
     - ReactiveEffect -> _trackId
     - ReactiveEffect -> _trackId
     - ReactiveEffect -> _trackId

```
3. keyMap 中需要带上一个清理函数，以便以在没有依赖的情况下删除清空key
4. 

```ts
const targetMap = new WeakMap<Object, DepKeyMap>(); // 存放依赖关系
export type DepKeyMap = Map<string, DepReactiveMap>;
export type DepReactiveMap = DepMap<
    ReactiveEffect,
    typeof ReactiveEffect.prototype._trackId
>;

export class DepMap<K, V> extends Map<K, V> {
    clearup: () => void;
    name: string | number;

    constructor(props: { clearup: () => void; name: string }) {
        super();
        this.clearup = props.clearup;
        this.name = props.name;
    }
}

export const createDep = <K, V>(
    clearup: () => void,
    key: string,
): DepMap<K, V> => {
    // 用于清理不需要的属性
    const dep = new DepMap<K, V>({clearup, name: key});
    return dep;
};

export function track(target: Object, key: string) {
    // 如果有activeEffect 说明这个key是在effect中访问的
    if (!activeEffect) {
        return;
    }
    let keysDepsMap = targetMap.get(target);

    if (!keysDepsMap) {
        targetMap.set(target, (keysDepsMap = new Map()));
    }
    let dep = keysDepsMap.get(key);

    if (!dep) {
        keysDepsMap.set(key, (dep = createDep(() => keysDepsMap!.delete(key), key))); // 后面可用于清理不需要的属性
    }
    // dep 类型为  Map<ReactiveEffect, number>  key为effect value为effect._trackId
    trackEffect(activeEffect, dep); //将当前 effect 放入dep映射表中，后续触发依赖变化时， 可以根据dep.name 来判断是否需要执行
}

export function trigger(
    target: Object,
    key: string,
    value: any,
    oldValue: any,
) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    let dep = depsMap.get(key);
    if (!dep) {
        return;
    }
    // Map<ReactiveEffect, _trackId>()
    triggerEffects(dep);
}
```


### trackEffect

1. trackId 的作用
   - 记录这是第几次收集 
   - 防止同一个属性重复收集
2. 对比下一次收集  diff 去掉没用的 加入新的【按照收集顺序】

```ts
export function trackEffect(effect: ReactiveEffect, dep: DepReactiveMap) {
    if (dep.get(effect) !== effect._trackId) {
        dep.set(effect, effect._trackId); // 更新ID
        // effect.deps [a属性中的ReactiveEffect, b属性中的ReactiveEffect]
        let oldDep = effect.deps[effect._depLength];
        if (oldDep !== dep) {
            if (oldDep) {
                // 删除oldDep
                cleanDepEffect(oldDep, effect);
            }
            effect.deps[effect._depLength++] = dep;
        } else {
            // 对比下一个
            effect._depLength++;
        }
    }
}
```

### triggerEffects

1. 触发effect中的调度函数
2. 改变effect中的脏值 触发了 这个effect 中的缓存值就是不干净了

```ts
export function triggerEffects(dep: Map<ReactiveEffect, number>) {
    for (const effect of dep.keys()) {
        // 触发了这个effect 的更新，那一定是有数据变更，所以要变成脏的
        if (effect._dirtyLevel < DirtyLevels.Dirty) {
            effect._dirtyLevel = DirtyLevels.Dirty
        }
        if (effect.scheduler) {
            if (!effect._running) {
                effect.scheduler();
            }
        }
    }
}
```


## ReactiveEffect 

这个是响应式体系中最核心的对象，所有的响应式都是在这里进行的，包括收集 触发的入口和出口

1. trackId 用于记录执行次数 (防止一个属性 在一个effect 中多次访问收集)
2. deps 依赖的属性列表  这个属性是双向记忆的  effect.deps [a属性中的ReactiveEffect, b属性中的ReactiveEffect]
3. _depLength 指针 二次收集对比的时候用 做对比和替换
4. _dirtyLevel 主要用于computed  记录是否脏 脏值重新计算 否则就取缓存值（上一次的计算结果）



```ts
function preCleanEffect(effect: ReactiveEffect) {
    effect._depLength = 0;
    effect._trackId++; // 每次执行id 都会+1， 如果当前同一个effect 执行id 就是相同的
}

function postCleanEffect(effect: ReactiveEffect) {
    if (effect.deps.length > effect._depLength) {
        for (let i = effect._depLength; i < effect.deps.length; i++) {
            cleanDepEffect(effect.deps[i], effect); // 删除映射表中对应的effect
        }
        effect.deps.length = effect._depLength; // 更新依赖列表中对应的长度
    }
}

export class ReactiveEffect {
    // 用于记录执行次数 (防止一个属性 在一个effect 中多次访问收集)
    _trackId = 0;

    // effect 依赖的属性列表  这个属性是双向记忆的  effect.deps [a属性中的ReactiveEffect, b属性中的ReactiveEffect]
    // 1. effect.deps 用于记录effect 依赖了哪些属性  2. dep 中又记录了哪些effect 依赖了这个属性
    deps: DepReactiveMap[] = [];
    // 指针 二次收集对比的时候用 做对比和替换
    _depLength = 0;
    // 这个参数可以控制依赖收集  如果active 为false 则不会收集依赖
    active = true;
    _dirtyLevel = DirtyLevels.Dirty

    fn: Function;
    scheduler: Function;
    _running = 0;

    /**
     * 响应式effect
     * @param fn 回调函数  如果fn 中依赖的函数发生变化后， 就要执行scheduler
     * @param scheduler 依赖变化了要执行的回调函数
     */
    constructor(fn: Function, scheduler: Function) {
        this.fn = fn;
        this.scheduler = scheduler;
    }

    run() {
        this._dirtyLevel = DirtyLevels.NoDirty // 运行结束后就标识为不脏
        if (!this.active) {
            return this.fn();
        }

        let lastActiveEffect = activeEffect;
        try {
            activeEffect = this;

            // effect 重新执行前，需要将上一次的依赖情况清除
            preCleanEffect(this);
            this._running++;
            return this.fn();
        } finally {
            this._running--;
            postCleanEffect(this);
            activeEffect = lastActiveEffect;
        }
    }

    stop() {
        if (this.active) {
            this.active = false;
            postCleanEffect(this);
            preCleanEffect(this);
        }
    }

    public get dirty() {
        return this._dirtyLevel === DirtyLevels.Dirty
    }

    public set dirty(v) {
        this._dirtyLevel = v ? DirtyLevels.Dirty : DirtyLevels.NoDirty
    }
}

```

## computed

1. 有一个缓存值_value
2. 懒执行
3. 核心还是一个effect


```ts

export class ComputedRefImpl {
    _value: any;
    public effect: ReactiveEffect;
    dep: DepMap<ReactiveEffect, number> | undefined


    constructor(getter: Function, public setter: Function) {
        // 我们需要创建一个effect
        this.effect = new ReactiveEffect(() => getter(this._value), () => {
            // 触发重新渲染
            triggerRef(this)
        })
    }

    // 让计算属性收集对应的effect
    get value() {
        if (this.effect.dirty) {
            this._value = this.effect.run()

            // 如果当前在effect 访问了计算属性，计算属性是可以收集这个effect

            trackRef(this)
        }
        return this._value
    }

    set value(v: any) {
        this.setter(v)
    }
}

```

## watch

watch的本质也是 收集依赖 触发依赖的过程，实现方式比computed 更简单


```ts
export function watch(source, cb, options = {}) {
    return doWatch(source, cb, options);
}


export function watchEffect(source, options = {}) {
    return doWatch(source, null, options);
}

function traverse(source, depth, currentDepth = 0, seen = new Set()) {
    if (!isObject(source)) {
        return source
    }
    if (depth) {
        if (depth >= currentDepth) {
            return source
        }
        currentDepth++
    }
    if (seen.has(source)) {
        return source
    }
    for (let key in source) {
        traverse(source[key], depth, currentDepth, seen)
    }
}

function doWatch(source: any, cb: any, {deep, immediate} = {}) {
    const reactiveGetter = (source) => traverse(source, deep === false ? 1 : void 0)

    let getter

    if (isReactive(source)) {
        getter = () => reactiveGetter(source)
    } else if (isRef(source)) {
        getter = () => source.value
    } else if (isFunction(source)) {
        getter = source
    }
    let oldValue;


    let clean
    const onCleanup = (fn) => {
        clean = () => {
            fn()
            clean = void 0
        }
    }


    const job = () => {
        if (cb) {
            const newValue = effect.run()
            cb(oldValue, newValue, onCleanup)
            oldValue = newValue
        } else {
            effect.run()
        }
    }

    const effect = new ReactiveEffect(getter, job)


    if (cb) {
        if (immediate) {
            job()
        } else {
            oldValue = effect.run()
        }
    } else {
        getter()
    }

    const unwacth = () => {
        effect.stop()
    }

    return unwacth


```

## ref

ref 实际上就是对简单数据做了一层包裹,使其成为了一个对象 它访问的key 就是value

```ts
export function ref(value: any) {
    return createRef(value);
}

function createRef(value: any) {
    return new RefImpl(value);
}

class RefImpl {
    __v_isRef = true; // ref标识
    _value: any; // 用来保存ref的值
    dep: DepMap<ReactiveEffect, number> | undefined;

    constructor(public rowValue: any) {
        this._value = toReactive(rowValue);
    }

    get value() {
        trackRef(this);
        return this._value;
    }

    set value(newValue: any) {
        if (newValue !== this.rowValue) {
            this.rowValue = newValue;
            this._value = newValue;
            triggerRef(this);
        }
    }
}

export function trackRef(ref: RefImpl | ComputedRefImpl) {
    if (activeEffect) {
        ref.dep = ref.dep || createDep(() => (ref.dep = undefined), "undefined");
        trackEffect(activeEffect, ref.dep);
    }
}

export function triggerRef(ref: RefImpl | ComputedRefImpl) {
    let dep = ref.dep;
    if (dep) {
        triggerEffects(dep);
    }
}

class ObjectRefImpl {
    __v_isRef = true; // ref标识
    _value: any; // 用来保存ref的值
    dep: DepMap<ReactiveEffect, number> | undefined;

    constructor(public rowValue: any, public key: string) {
        this._value = toReactive(rowValue);
    }

    get value() {
        return this.rowValue[this.key];
    }

    set value(newValue: any) {
        this._value = newValue;
        triggerRef(this);
    }
}

export function toRef(obj: any, key: string) {
    return new ObjectRefImpl(obj, key);
}

export function toRefs(obj: any) {
    for (const key in obj) {
        obj[key] = toRef(obj, key);
    }
    return obj;
}

export function proxyRefs(objectWithRef: any) {
    return new Proxy(objectWithRef, {
        get(target, key, receiver) {
            let r = Reflect.get(target, key, receiver);
            return r.__v_isRef ? r.value : null;
        },
        set(target: any, key: string | symbol, newValue: any, receiver: any): boolean {
            const oldValue = target[key];
            if (oldValue.__v_isRef) {
                oldValue.value = newValue;
                return true
            }
            return Reflect.set(target, key, newValue, receiver);
        }
    })
}

```

