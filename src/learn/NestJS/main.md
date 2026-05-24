---
icon: akar-icons:file
date: 2025-12-17
order: 1
category:
  - NestJS
---

# NestJS简介

NestJS 是一个用于构建高效且可扩展的服务器端应用程序的渐进式 Node.js 框架。它使用 TypeScript 编写，并结合了面向对象编程（OOP）、函数式编程（FP）和函数响应式编程（FRP）的元素。NestJS 架构灵感来自于 Angular，因此如果你熟悉 Angular，你会发现 NestJS 的设计理念和结构非常相似。

## 创建项目

**前置条件**

- Nodejs: 版本 >= 20 (推荐使用最新的LTS版本)
  `node --version` 查看当前版本
- 包管理器: pnpm (推荐使用pnpm, 也可以使用npm或yarn)
  `pnpm --version` 查看当前版本

```shell
pnpm add -g @nestjs/cli
nest new project-name
```

## 核心文件概述

| 文件                    | 描述           |
|-----------------------|--------------|
| xx.controller.ts      | 具有单个路由的基本控制器 |
| xx.controller.spec.ts | 控制器的单元测试     |
| xx.module.ts          | 一个模块的根       |
| xx.service.ts         | 服务层，具体逻辑的实现  |
| main.ts               | 应用程序的入口文件    |

## 文件结构

```text
----- src
  ├── common                     // 公共模块
  │    └── decorators            // 自定义装饰器
  │         └── public.decorator.ts    // 装饰器
  ├── config 
  │    ├── index.ts              // 数据库等配置文件
  │    └── jwt.config.ts         // jwt配置文件
  ├── constants                     // 常量文件
  │    └── index.ts              // 常量 字典
  ├── decorator                    // 自定义装饰器
  │    ├── user.decorator.ts        // 用户装饰器
  │    └── response.decorator.ts     // 返回类型装饰器
  ├── entity                       // 实体类
  │    └── user.entity.ts         // 用户实体类
  ├── interceptor                       // 拦截器
  │    └── logging.interceptor.ts    // 日志拦截器
  ├── middleware                       // 中间件
  │    └── logger.middleware.ts      // 日志中间件
  ├── module                       // 模块
  │    ├── auth                     // 认证模块
  │        ├── auth.controller.ts      // 认证控制器
  │        ├── auth.module.ts          // 认证模块
  │        ├── auth.service.ts         // 认证服务
  │        └── dto                   // 数据传输对象
  ├── app.controller.ts          // 应用程序的主控制器
  ├── app.module.ts              // 应用程序的主模块
  ├── app.service.ts             // 应用程序的主服务
  ├── interceptor               // 全局拦截器
  │    ├── logging.interceptor.ts    // 日志拦截器
  │    └── reponse.interceptor.ts    // 响应拦截器
  └── main.ts                    // 应用程序的入口文件
----- test
  └── app.e2e-spec.ts            // 端到端测试文件
----- .gitignore                  // Git忽略文件
----- nest-cli.json               // Nest CLI配置文件
----- .prettierrc                 // 代码格式化配置文件
----- eslint.config              // ESLint配置文件
----- package.json                // 项目依赖和脚本
----- tsconfig.build.json         // TypeScript编译配置文件
----- tsconfig.json               // TypeScript配置文件
```

## main.ts

```ts
import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {ValidationPipe} from '@nestjs/common'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import {ResponseInterceptor} from '@src/interceptor/reponse.interceptor'
import {LoggingInterceptor} from '@src/interceptor/logging.interceptor'

async function bootstrap() {
  // 创建APP
  const app = await NestFactory.create(AppModule)

  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor())
  // 构建swagger文档
  const options = new DocumentBuilder().setTitle('CrazyPlayerServer').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  })
  // 全局管道 验证和转换 class-validator class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 过滤 DTO 中不存在的字段
      forbidNonWhitelisted: false,
      transform: true, // 自动类型转换
      transformOptions: {enableImplicitConversion: true},
    }),
  )
  await app.listen(3000)
}

bootstrap()


```

## 运行程序

```shell
npm run start
```
