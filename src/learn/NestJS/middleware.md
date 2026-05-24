---
icon: akar-icons:file
date: 2025-12-17
order: 5
category:
  - NestJS
---

# 中间件

中间件是在路由处理程序之前调用的函数。中间件函数可以访问请求和响应对象，以及应用程序请求-响应周期中`next()`中间件函数的调用。下一个中间件函数通常由名称`next`表示。

中间件函数可以执行以下任务

- 执行任意代码
- 修改请求和响应对象
- 结束请求-响应周期
- 调用堆栈中的下一个中间件函数
- 如果当前中间件函数没有结束请求-响应周期，则必须调用`next()`函数将控制权传递给下一个中间件函数。否则，请求将被挂起。

## 示例

```ts  logger.middleware.ts
import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

```

## 应用中间件

```ts  app.module.ts
import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {LoggerMiddleware} from './common/middleware/logger.middleware';
import {CatsModule} from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // 路由排除
      .exclude(
        {path: 'cats', method: RequestMethod.GET},
        {path: 'cats', method: RequestMethod.POST},
        'cats/{*splat}'
      )
      .forRoutes('cats');
  }
}
```

- 支持特定方法`.forRoutes({ path: 'cats', method: RequestMethod.GET })`
- 支持通配符`.forRoutes({ path: 'abcd/*splat',method: RequestMethod.ALL,})`
- 支持路由器类 `forRoutes(CatsController);`

### 路由排除

```ts
exclude(
  {path: 'cats', method: RequestMethod.GET},
  {path: 'cats', method: RequestMethod.POST},
  'cats/{*splat}'
)
```

### 多个中间件

```ts
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

### 全局中间件

如果我们需要一次性将中间件绑定到所有已注册的路由，可以使用 INestApplication 实例提供的 use() 方法：

```ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(process.env.PORT ?? 3000);
```
