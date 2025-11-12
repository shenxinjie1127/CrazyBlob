---
icon: akar-icons:file
date: 2024-03-13
order: 4
category:
  - JavaScript
---

# 防抖节流

## 防抖

**后执行**当持续触发事件，一定时间内没有再次触发事件，事件处理函数就会执行一次；如果在设定的事件内又出发了一次，那么就重新计时并不执行函数。

```typescript :no-line-numbers

var input = document.getElementById('input')

//防抖函数
function debounce(delay: number) {
    let timer
    return function (value) {
        clearTimeout(timer)
        /*
        * 我们想清除的是setTimeout 我们应该要存储timer这个变量
        * 所以timer变量需要保存在内存中
        * 所以在触发之前需要清除之前的定时器
        * timer存储在内存中就要涉及到内存的泄露和闭包
        * */
        timer = setTimeout(function () {
            console.log(value);
        }, delay)
    }
}

// 我们需要的是在键盘抬起后不再输入后的一秒之后触发函数打印
var debounceFunc = debounce(1000) // 这个是一个函数
input.addEventListener('keyup', function (e) {
    debounceFunc(e.target.value)
})
```

### 实际应用

- 输入框搜索
- 按钮点击
- 浏览器窗口缩放
- 滚动条滚动
- 表单验证
- 鼠标移动

## 节流

**前执行**当持续触发事件，一定时间内只能触发一次。

```typescript :no-line-numbers

function thro(wait: number, callback: Function) {
    /*
    * 就是要做到在一定的时间内只执行一次
    *
    * */
    let timeout
    return function () {
        //只要存在timeout 就无法进入这个函数执行
        if (!timeout) {
            timeout = setTimeout(function () {
                callback()
                //执行完成之后 将timeout置空
                timeout = null
            }, wait)
        }
    }
}

function handel() {
    console.log('执行');
}

document.getElementById('button').onclick = thro(2000, handel)
```

## 区别

他们都是可以防止一个函数被无意义的高频率调用

- 函数节流：是确保函数特定的时间内至多执行一次。
- 函数防抖：是函数在特定的时间内不被再调用后执行。

----------------

- 函数节流：是确保函数特定的时间内至多执行一次。
- 函数防抖：是函数在特定的时间内不被再调用后执行。