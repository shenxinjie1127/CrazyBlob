---
icon: akar-icons:file
date: 2025-12-17
order: 6
category:
  - NestJS
---

# 异常处理

## 异常抛出

在`@nestjs/common`包中有一个`HttpException`类

```text
@Get()
async findAll() {
 throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

## 自定义异常

自定义异常继承基础 HttpException 类

```ts
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

## 内置HTTP异常（常用）

- `BadRequestException`：对应HTTP状态码400。
- `UnauthorizedException`：对应HTTP状态码401。
- `ForbiddenException`：对应HTTP状态码403。
- `NotFoundException`：对应HTTP状态码404。
- `MethodNotAllowedException`：对应HTTP状态码405。
- `NotAcceptableException`：对应HTTP状态码406。
- `RequestTimeoutException`：对应HTTP状态码408。
- `ConflictException`：对应HTTP状态码409。
- `GoneException`：对应HTTP状态码410。
- `PayloadTooLargeException`：对应HTTP状态码413。

## 异常过滤器

如果需要对异常层进行完全的控制 就需要自己创建一个异常过滤器

```ts
import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}

```

## 绑定过滤器

可以通过三种方式将过滤器绑定到应用程序中：

- 全局绑定
- 控制器级别绑定
- 方法级别绑定

### 全局绑定

```ts
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {HttpExceptionFilter} from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}

bootstrap();
```

### 控制器级别绑定

```ts
import {Controller, Get, UseFilters} from '@nestjs/common';
import {HttpExceptionFilter} from './http-exception.filter';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
  @Get()
  findAll() {
    throw new HttpException('Forbidden', 403);
  }
}
```

### 方法级别绑定

```ts
import {Controller, Get, UseFilters} from '@nestjs/common';
import {HttpExceptionFilter} from './http-exception.filter';

@Controller('cats')
export class CatsController {
  @Get()
  @UseFilters(HttpExceptionFilter)
  findAll() {
    throw new HttpException('Forbidden', 403);
  }
}
```

### 放在Porvide中

```ts
import {Module} from '@nestjs/common';
import {APP_FILTER} from '@nestjs/core';
import {HttpExceptionFilter} from './http-exception.filter';
import {CatsController} from './cats.controller';

@Module({
  controllers: [CatsController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
}
```

## 捕获所有异常

为了捕获每一个未处理的异常（无论异常类型如何），只需让 @Catch() 装饰器的参数列表为空即可，例如 @Catch()。

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {HttpAdapterHost} from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const {httpAdapter} = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}


```
