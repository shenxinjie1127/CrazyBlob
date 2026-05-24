---
icon: akar-icons:file
date: 2025-12-17
order: 3
category:
  - NestJS
---

# 控制器

控制器主要负责处理传入的请求向客户端返回响应

## 路由

使用`@Controller`装饰器来定义控制器类，并使用`@Get`、`@Post`等装饰器来定义路由处理方法。

### 请求对象

- `@Body()`装饰器用于提取请求体中的数据。
- `@Param()`装饰器用于提取路由参数。
- `@Query()`装饰器用于提取查询参数。
- `@Req()`装饰器用于获取请求对象。'

### 请求方法

- `@Get()`：处理HTTP GET请求。
- `@Post()`：处理HTTP POST请求。
- `@Put()`：处理HTTP PUT请求。
- `@Delete()`：处理HTTP DELETE请求。
- `@Patch()`：处理HTTP PATCH请求。
- `@Options()`：处理HTTP OPTIONS请求。

### 路由通配符

`*` 可以作为通配符，匹配路径末尾任意字符组合

```ts
@Get('abcd/*')
findAll()
{
  return 'This route uses a wildcard';
}
```

### 状态码

可以使用`@HttpCode()`装饰器来设置响应的HTTP状态码

- `@HttpCode(HttpStatus.OK)`：设置状态码为200。
- `@HttpCode(HttpStatus.CREATED)`：设置状态码为201。
- `@HttpCode(HttpStatus.NO_CONTENT)`：设置状态码为204。
- `@HttpCode(HttpStatus.BAD_REQUEST)`：设置状态码为400。
- `@HttpCode(HttpStatus.UNAUTHORIZED)`：设置状态码为401。
- `@HttpCode(HttpStatus.FORBIDDEN)`：设置状态码为403。
- `@HttpCode(HttpStatus.NOT_FOUND)`：设置状态码为404。
- `@HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)`：设置状态码为500。

### 指定响应头

可以使用`@Header()`装饰器来设置响应头

`@Header('Cache-Control', 'none')`

### 重定向

可以使用`@Redirect()`装饰器来实现重定向

`@Redirect('https://nestjs.com', 301)`

### 请求负载

我们需要先定义 DTO（数据传输对象）模式。DTO 是一个规定了网络数据传输格式的对象。我们可以使用 TypeScript 接口或简单类来定义 DTO 模式

```ts
export class SignInDTO {
  @ApiProperty({
    description: '手机号码',
    type: 'string',
    required: true,
    default: '17826737860',
  })
  @IsNotEmpty({message: '手机号码不可为空'})
  @IsPhoneNumber('CN', {message: '请输入正确的手机号码'})
  readonly phone: string

  @ApiProperty({
    description: '密码',
    type: 'string',
    required: true,
    default: 'Aa123456',
  })
  @IsNotEmpty({message: '密码不可为空'})
  readonly password: string
}
```

### 示例

```ts title="auth.controller.ts"
import {Controller, Post, Body, HttpStatus, HttpCode} from '@nestjs/common'
import {AuthService} from './auth.service'
import {Public} from '@common/decorators/public.decorator'
import {ApiExtraModels, ApiOperation, ApiTags} from '@nestjs/swagger'
import {ResponseDTO} from '@src/interceptor/reponse.interceptor'
import {ApiResponseDTO} from '@src/decorator/response.decorator'
import {SignInDTO, SignUpDTO} from '@modules/auth/dto/request.dto'
import {SignInResDto, SignUpResDto} from '@modules/auth/dto/response.dto'

@ApiTags('Auth')
@ApiExtraModels(ResponseDTO, SignUpResDto, SignInResDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @ApiResponseDTO(SignUpResDto)
  @ApiOperation({
    summary: '注册',
  })
  @Public()
  @Post('sign-up')  // 路由为 /auth/sign-up
  @HttpCode(HttpStatus.OK)
  signUp(@Body() signUpDto: SignUpDTO) {
    return this.authService.signUp(signUpDto)
  }

  @ApiResponseDTO(SignUpResDto)
  @ApiOperation({
    summary: '登录',
  })
  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService.signIn(signInDto)
  }
}
```

