---
icon: akar-icons:file
date: 2025-08-21
order: 3
category:
  - Utils
---

# 时间转化工具

## dayjs

### 下载

::: code-tabs#shell
@tab npm

```bash :no-line-numbers
npm install dayjs --save
```

@tab yarn

```bash :no-line-numbers
yarn add dayjs
```

@tab pnpm

```bash :no-line-numbers
pnpm add dayjs
```

:::

### 使用

```typescript :no-line-numbers
import dayjs from 'dayjs';

const now = dayjs(); // 获取当前时间
```

#### 格式化时间

```typescript :no-line-numbers
const formatted = now.format('YYYY-MM-DD HH:mm:ss'); // 格式化为字符串
```

#### 增加时间 | 减少时间

```typescript :no-line-numbers
const nextWeek = now.add(7, 'day'); // 增加7天
const lastMonth = now.subtract(1, 'month'); // 减少1个月
```

#### 比较时间

```typescript :no-line-numbers
const isBefore = now.isBefore(nextWeek); // 判断是否在下周之前
const isAfter = now.isAfter(lastMonth); // 判断是否在上个月之后
```

#### 获取时间戳

```typescript :no-line-numbers
const timestamp = now.valueOf(); // 获取时间戳（毫秒）
const unixTimestamp = now.unix(); // 获取Unix时间戳（秒）
```

#### 转换为其他格式

```typescript :no-line-numbers
const isoString = now.toISOString(); // 转换为ISO 8601格式
const utcString = now.utc().format(); // 转换为UTC时间字符串
```

#### 当月 当天 开始和结束

```typescript :no-line-numbers
const startOfMonth = now.startOf('month'); // 当月开始时间
const endOfMonth = now.endOf('month'); // 当月结束时间
const startOfDay = now.startOf('day'); // 当天开始时间
const endOfDay = now.endOf('day'); // 当天结束时间
```

#### 国际化

```typescript :no-line-numbers
import 'dayjs/locale/zh-cn'; // 引入中文语言包
dayjs.locale('zh-cn'); // 设置为中文
const localized = now.format('YYYY年MM月DD日 HH:mm:ss'); // 格式化为中文格式
```

```typescript :no-line-numbers
import 'dayjs/locale/es' // load on demand

dayjs.locale('es') // use Spanish locale globally

dayjs('2018-05-05').locale('zh-cn').format() // use Chinese Simplified locale in a specific instance
```

#### 封装

```typescript
import {useI18n} from "vue-i18n";
import dayjs from "dayjs";

enum FORMAT_TYPE {
    Date,
    Time,
    DateTime
}

const {locale} = useI18n();

function format(datetime: string | number, type = FORMAT_TYPE.DateTime) {
    switch (locale.value) {
        case "zh":
            if (type === FORMAT_TYPE.Date) {
                return dayjs(datetime).format("YYYY-MM-DD");
            }
            if (type === FORMAT_TYPE.Time) {
                return dayjs(datetime).format("HH:mm:ss");
            }
            return dayjs(datetime).format("YYYY-MM-DD HH:mm:ss");
        case "en":
            if (type === FORMAT_TYPE.Date) {
                return dayjs(datetime).format("MM/DD/YYYY");
            }
            if (type === FORMAT_TYPE.Time) {
                return dayjs(datetime).format("HH:mm:ss");
            }
            return dayjs(datetime).format("MM/DD/YYYY HH:mm:ss");
        case "de":
            if (type === FORMAT_TYPE.Date) {
                return dayjs(datetime).format("DD.MM.YYYY");
            }
            if (type === FORMAT_TYPE.Time) {
                return dayjs(datetime).format("HH:mm:ss");
            }
            return dayjs(datetime).format("DD.MM.YYYY HH:mm:ss");
        case "fr":
            if (type === FORMAT_TYPE.Date) {
                return dayjs(datetime).format("DD/MM/YYYY");
            }
            if (type === FORMAT_TYPE.Time) {
                return dayjs(datetime).format("HH:mm:ss");
            }
            return dayjs(datetime).format("DD/MM/YYYY HH:mm:ss");
        case "it":
            if (type === FORMAT_TYPE.Date) {
                return dayjs(datetime).format("DD/MM/YYYY");
            }
            if (type === FORMAT_TYPE.Time) {
                return dayjs(datetime).format("HH:mm:ss");
            }
            return dayjs(datetime).format("DD/MM/YYYY HH:mm:ss");
    }
}
```