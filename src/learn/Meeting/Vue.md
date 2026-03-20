#### 什么是Vue 中的 slot ,他的作用

1. 模版传递，可以自定义传递模版内容
2. 在子组件内部是一个区域占位符，父组件可以根据子组件内部定义的插槽去传递内容
3. 有三种类型的插槽 默认插槽 具名插槽 作用域插槽


#### Vue Router 配置404 页面

```ts
import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 其他路由...
    { path: '/', component: Home },
    { path: '/about', component: About },
    
    // 404 路由配置 - 放在最后
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
})

```

#### Vue3 相对于 Vue2 做了哪些优化？

Vue3 的优化主要在于编译时优化，比如静态提升，补丁标志和更加高效的响应式体系（proxy）,这使得渲染更快，更新性能更强，内存占用更少


##### 拆解说明

1. 编译时优化
   1. Patch Flags: vue3 在编译模版时，会为动态节点（带有V-bind v-on 或插值的元素）添加一个数字表述，在更新的时候，渲染器只需要关注这个标识，就知道哪些节点是可更新的，从而跳过对不相关属性的比较，这极大的减少了virtual dom diff 的工作量
   2. 静态树提升： 对于模版中完全静态的内容，编译器会将其提升到渲染函数之外，这意味着静态部分只会在应用启动时被创建一次，并在后学的所有渲染中被复用。这大大减少了不必要的虚拟节点的创建和内存的消耗。
   3. 事件监听缓存器： 默认情况下 如果一个事件监听器没有动态绑定 【@click="handler"】 它会被缓存起来。这避免了每次组件更新时都会创建一个新的函数，大大降低了内存压力和垃圾回收的频率


#### 为什么Vue 默认使用模版语法，而不是像React 那样使用JSX 模版语法有什么好处

1. 降低门槛，提升体验，模版语法基于标准的HTML 对于初学者来说比较友好
2. 声明式与直观性：模版结构更加清晰，代码可读性强，这种方式会限制灵活性
3. 关注点分离：SFC 优势， 模版 逻辑 样式各部分分离，各司其职

#### vue 项目中的优化

1. v-if  v-show
2. v-memo  这是一个性能指令，可以用来记忆模版的一部分。如果v-memo的依赖数组中的值没有发生变化，vue将跳过对该VNode 以及整个子树的更新
3. 虚拟滚动/ 虚拟列表
4. 组件懒加载 异步加载
5. keep alive computed（结果缓存）