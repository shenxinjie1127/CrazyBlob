---
icon: akar-icons:file
date: 2026-05-22
order: 15
category:
  - JavaScript
---


# 高阶函数及应用

## 封装动画函数  数字变化

```javascript

function animation(duration, from, to, onProgress) {
    // 插值
    const dis = to - from
    const speed = dis / duration
    const startTIme = Date.now();
    let value = from; // 当前值
    
    function fun() {
        const now = Date.now()
        const time = now -startTIme
        if (time >= duration) {
            value = to
            return
        }
        const d = time * speed
        value = foem + d
        onProgress(value)
        requestAnimationFrame(run)
    }
    requestAnimationFrame(run)
}

```

## 频繁事件触发导致的卡顿

常见的场景  ： 窗口变化导致的一些图表的重新渲染

### 背景
1. 频繁触发
2. 存在耗时操作
3. 仅关心最后一次的触发

### 防抖

```javascript
function debounce(fn, duration) {
    let timer
    return function (...arg) {
        clearTimeout(timer)
       timer = setTimeout(() => {
            fn.apply(this,...arg)
        },duration)
    }
}
```

## 并发任务的执行

```ts

function paralleTask(tasks: Promise[], parallelCount = 2) {
    return new Promise((resolve, reject) => {
        if (tasks.length === 0) {
            resolve()
            return
        }
        let nextIndex = 0
        let finishCount = 0

        function _run() {
            const task = tasks[nextIndex]
            nextIndex++
            task().then(() => {
                finishCount++
                if (nextIndex < tasks.length) {
                    _run()
                } else if(finishCount === tasks.length) {
                    resolve()
                }
            })
        }
        
        for (let i = 0; i< parallelCount & i< tasks.length; i++) {
            _run()
        }
    })

}
```

## 参数归一化

以format 函数为例

```typescript

// 2023-4-6
format(new Date(), 'date')

// 2023-4-5 14:22:22
format(new Date(), 'datetime')

// 2023-04-06

format(new Date(), 'date', true)

// 2023年5月6日 13:7:2
format(new Date(), 'yyyy年MM月dd日 HH:mm:ss')


format(new Date(), (dateInfo) => {
    const {year } = dateInfo;
    const thisYear = new Date().getFullYear()
    if (year < thisYear) {
        return `${thisYear - yaer}年前`
    } else if(year > thisYear) {
        return `${year - thisYear}年后`
    } else {
        return  '今年'
    }
})

```

遇到这样的情况 就可以把参与统一为一个函数  把多参数都转化为一个函数


```typescript

function _formatNormalize(formatter, isPad) {
    if (typeof formatter === 'function') {
        return formatter
    }
    if (typeof  formatter !== 'string') {
        throw new TypeError('formatter must be a string')
    }
    if (formatter === 'date') {
        formatter = 'yyyy-MM-dd'
    } else if(formatter === 'datetime') {
        formatter = 'yyyy-MM-dd HH:mm:ss'
    }
    
    const formatterFun = (dataInfo) => {
        const {yyyy,MM,dd, HH, mm, ss} = dataInfo
        
        return formatter.replaceAll('yyyy', yyyy).replaceAll('MM', MM)
    }
    
    return
}

function format(date:Date, formatter, isPad) {
    const _formatter = _formatNormalize(formatter, isPad)
    const dateInfo = {
        yyyy: date.getFullYear().toString(),
        MM: (date.getMonth() +1).toString(),
        dd: date.getDate().toString(),
        HH: date.getHours().toString(),
        mm: date.getMinutes().toString(),
        ss: date.getSeconds().toString(),
        ms: date.getMilliseconds().toString(),
    }
    
    // 将某个属性填充到指定长度 补充0
    function _pad(prop, len) {
        dateInfo[prop] = dateInfo[prop].padStart(len, '0')
    }
    if (isPad) {
        _pad('yyyy', 4),
            ...
    }
    
   return  _formatter(dateInfo)
    
}


```

## 惰性函数
减少判断次数， 提高执行效率

```typescript

function copyText(text: string) {

    if(navigate.clipboard) {
        copyText = (text: string) => {
            navigator.clipboard.writeText(text)
        }
    } else {
        // 兼容IE
        copyText = (text) => {
            const input = document.createElement('input')
            input.setAttribute('value', text)
            document.body.appendChild('input');
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input)
        }
    }

}

```

```typescript

function createCopyText() {
    if(navigate.clipboard) {
        return (text: string) => {
            navigator.clipboard.writeText(text)
        }
    } else {
        // 兼容IE
        return (text) => {
            const input = document.createElement('input')
            input.setAttribute('value', text)
            document.body.appendChild('input');
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input)
        }
    }
}

```

##  长任务执行优化

```typescript


const _chunkSplitor = (task) => {
    setTimeout(() => {
        task((itme) => time < 16)
    }, 50)
}

function performChunk(datas, consumer, chunkSplitor) {

    if (typeof datas === 'number') {
        datas = new Array(datas)
    }
    if (datas.length === 0) {
        return
    }

    if (!chunkSplitor && globalThis.requestIdleCallback) {
        chunkSplitor = (task) => {
            requestIdleCallback((idle) => {
                task(() => idle.timeRemaining() > 0)
            })
        }
    }

    let i = 0;


    function _run() {
        if (i === datas.length) {
            return
        }

        chunkSplitor((hasTime) => {
            const now = Date.now()
            while (hasTime(Date.now - now) && i < datas.length) {
                const item = datas[i]
                consumer(item, i)
                i++
            }
            _run()
        })
    }
    
    _run()

}


```


