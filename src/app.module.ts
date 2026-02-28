import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TokenModule } from './modules-system/token/token.module';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { UsersModule } from './modules-api/users/users.module';
import { AuthModule } from './modules-api/auth/auth.module';
import { MoviesModule } from './modules-api/movies/movies.module';
import { BannerModule } from './modules-api/banner/banner.module';
import { SystemsModule } from './modules-api/systems/systems.module';
import { ProtectGuard } from './common/guards/protect.guard';

@Module({
  imports: [
    TokenModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    MoviesModule,
    BannerModule,
    SystemsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ProtectGuard,
    },
  ],
})
export class AppModule {}
