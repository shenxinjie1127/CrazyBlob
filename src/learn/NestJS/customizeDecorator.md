---
icon: akar-icons:file
date: 2025-12-17
order: 9
category:
  - NestJS
---

# 自定义装饰器 @User

该方法主要是为了拿取接口信息中的auth token解析后的用户信息，方便在控制器中使用。

```ts title="src/decorators/user.decorator.ts"
import {createParamDecorator, ExecutionContext} from '@nestjs/common'
import {Request} from 'express'
import {REQUEST_USER_KEY} from '@src/constants'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest()
  return request[REQUEST_USER_KEY] as TokenParam
})

```

在添加此装饰器前需要在Guard中将用户信息解码并放入请求对象中，例如：

```ts
import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {Reflector} from '@nestjs/core'
import {REQUEST_USER_KEY} from '@src/constants'
import jwtConfig from '../../../config/jwt.config'
import {IS_PUBLIC_KEY} from '@common/decorators/public.decorator'
import * as config from '@nestjs/config'
import {Request} from 'express'

/**
 * 验证访问令牌
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
    private readonly reflector: Reflector,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 公共接口直接放行   reflector可以读取元数据  比如这里的IS_PUBLIC_KEY
    const isPublic: boolean = this.reflector.get(IS_PUBLIC_KEY, context.getHandler())
    if (isPublic) return true
    // 验证访问令牌 过期 失效
    const request: Request = context.switchToHttp().getRequest()
    // 从请求头中提取令牌
    const token: Undefined<string> = this.extractTokenFromHeader(request)
    if (!token) throw new UnauthorizedException()

    try {
      // 验证令牌
      request[REQUEST_USER_KEY] = await this.jwtService.verifyAsync(token, this.jwtConfiguration)
    } catch (error) {
      throw new UnauthorizedException(error)
    }
    return true
  }

  private extractTokenFromHeader(request: Request): Undefined<string> {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : void 0
  }
}
```
