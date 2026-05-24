---
icon: akar-icons:file
date: 2026-04-27
order: 1
category:
  - Micro Fontends
---

# 微前端的历史

在一家公司中你开发了一个考勤系统， 这个考勤系统已经运行了很久，技术比较老

然后过了几年 又有新的系统 比如财务系统，库存管理系统，陆陆续续需要加入这个系统。但员工肯定不想再不通的系统中来回切换， 不停的重复登录

这个时候重构原来的项目成本就很大，而且不同的项目技术栈可能不同，兼容起来比较麻烦

还有一种情况，就上给不同的人员不同的站点，比如客户用的，内部员工用的，系统有公用部分，也有私有化部分

## 解决办法
1. 弄一个整合项目，里面能吧之前开发的各个系统都在这个项目里直接使用，不用重复开发
2. 各个系统是独立的，有自己独立的仓库，哪个大系统要用某个小系统，直接接入大系统就行


## iframe

1. 无法像同一个项目中那样通讯，无法方便的传递消息，相互改变彼此的数据
2. 无法共享登录状态


## 知识储备

1. 我们写的vue react 项目 本质上所有的内容都是通过执行项目的js，js去在项目上绘制出页面和执行逻辑
2. 那么只需要通过请求要加载的系统的js，然后让他在我们的主项目里面执行。
3. 拿到的js 内容是字符串，不是js代码，但是我们可以用eval去执行字符串形式的代码。 css 就用创建style标签的形式
    ```js
    fetch('xxx').then(res => {
     return res.text()
   }).then(text => {
    eval(text)
   })
    ```
4. 路由切换子应用(监听路由变化)
   - 输入url回车或者a标签 直接在项目初始化时获取pathname
   - vue/react 路由跳转（history模式）监听popState事件（需要重写pushState）

在vue/react  路由变化 原理是  history.pushState()

待解决的问题

1. 样式冲突问题
2. 作用域冲突问题 公用windows
3. 全局监听，定时器 计时器 卸载问题


## 解决样式冲突

采用动态插入，把style标签插入到son app 的div内部，这样在切换子应用的时候，内容和style 会被一起清空，这样就不会把样式保留下来
 

这样还不够，子应用内部可能还写了一些全局样式，从而影响到主应用。所以要解决这个问题

1. 子应用挂载到son 这个div中，我们给子应用的所有类加上 #son这个父类选择器
2. body root这样的选择器第一条处理解决不了，但是一般子应用里不会写这些，写了有可能是一些特殊需要

## 解决window 污染

每个子项目都需要一个独立的window，

解决办法，使用作用域的理念 在执行子应用js 的时候传入一个假的window  并且使用proxy 代理这个window  假的window 有就用假的，不然就去真的上面找

```javascript
function createProxyWindow() {
    const realWindow = window
   const fakeWindow = Object.create(null)
   return new Proxy(fakeWindow, {
       get(target, property, receiver) {
           const value = Reflect.get(target, property,receiver) || realWindow[property]
          
          if (typeof value === 'function') {
              return value.bind(realWindow)
          }
          return value
       },
       set(target, p, newValue, receiver) {
           Reflect.set(fakeWindow, p, newValue, receiver)
          return true
       }
   })
}
```
## 解决事件监听的问题

重写事件绑定和定时器方法 ，放入一个数组 ，卸载子应用的时候清除掉