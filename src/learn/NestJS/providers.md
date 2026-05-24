---
icon: akar-icons:file
date: 2025-12-17
order: 4
category:
  - NestJS
---

# 提供者

在 NestJS 中，提供者（Providers）是用于实现依赖注入（Dependency Injection）的核心概念。它们通常是类，可以被注入到其他类中，以实现松耦合和模块化设计。

基础Nest类（如服务、存储库、工厂和辅助工具）

比如在auth.module.ts 中注入 auth.service.ts

```ts

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PermissionEntity]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
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

在auth.controller.ts 中使用 auth.service.ts

```ts title="auth.controller.ts"

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
}
```
