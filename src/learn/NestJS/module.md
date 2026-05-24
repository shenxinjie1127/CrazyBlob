---
icon: akar-icons:file
date: 2025-12-17
order: 2
category:
  - NestJS
---

# 模块引入和单个模块基础

NestJS 是一个模块化的框架，应用程序由多个模块组成。每个模块封装了一组相关的功能和服务。下面是如何引入和使用单个模块的基础知识。

## 创建模块

```shell
nest generate resource xxx
```

上面的命令会生成一个名为 xxx 的模块，包含控制器、服务和 DTO 文件。

## 引入模块

模块想要成功引入到应用程序中，需要在根模块（通常是 app.module.ts）中进行注册。

```typescript
import {Module} from '@nestjs/common'
import {AppController} from '@src/app.controller'
import {AppService} from '@src/app.service'
import {AuthModule} from '@modules/auth/auth.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {databaseConfig} from './config'
import {UserEntity} from '@entity/user.entity'
import {RoleEntity} from '@entity/role.entity'
import {PermissionEntity} from '@entity/permission.entity'
import {GiftEntity} from '@entity/gift.entity'
import {GiftModule} from '@modules/gift/gift.module'
import {UserModule} from '@modules/user/user.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    // 放入的位置
    AuthModule
  ],
})
export class AppModule {
}
```

## 模块结构

一个典型的模块结构如下：

```text
--- auth
   ├── auth.controller.ts      // 认证控制器
   ├── auth.service.ts         // 认证服务
   ├── auth.module.ts          // 认证模块
   ├── dto                     // 数据传输对象
```

### 模块（auth.module.ts）

模块是一个用`@module()` 装饰器注解的类。该装饰器提供了元数据。

每个 Nest 应用程序至少有一个模块，即 根模块 ，它是 Nest 构建应用程序图的起点。该图是一种内部结构，Nest 利用它来解决模块和提供程序（提供者）之间的关系和依赖性问题。虽然小型应用程序可能只有一个根模块，但一般情况并非如此。强烈推荐使用模块作为组织组件的有效方式。对于大多数应用程序，您可能会拥有多个模块，每个模块都封装了一组密切相关的功能 。

| 属性          | 描述                                                        |
|-------------|-----------------------------------------------------------|
| providers   | 将由Nest注入器实力化， 且至少可在本模块内共享的提供者                             |
| controllers | 本模块中定义的需要实例化的控制器集合                                        |
| imports     | 导入模块的列表，这些模块导出了本模块所需的提供者                                  |
| exports     | 本模块提供的providers子集，这些提供者可供导入本模块的其他模块使用。可以使用提供者本身或其provide值 |

**实例**

```ts title="auth.module.ts"
import {Module} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthController} from './auth.controller'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UserEntity} from '@entity/user.entity'
import {ConfigModule} from '@nestjs/config'
import jwtConfig from '../../config/jwt.config'
import {JwtModule} from '@nestjs/jwt'
import {APP_GUARD} from '@nestjs/core'
import {AccessTokenGuard} from './guards/access-token.guard'
import {HashingService} from './hashing.service'
import {PermissionEntity} from '@entity/permission.entity'
import {PermissionModule} from '@modules/permission/permission.module'

@Module({
  imports: [
    // 使用了那些表
    TypeOrmModule.forFeature([UserEntity, PermissionEntity]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    // 其他module
    PermissionModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AuthService,
    HashingService,
  ],
})
export class AuthModule {
}
```
