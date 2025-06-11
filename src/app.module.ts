import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './common/config/config.schema';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './common/database/database.module';
import { StorageModule } from './common/storage/storage.module';
import { CacheModule as CustomCacheModule } from './common/cache/cache.module';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: Number.parseInt(process.env.GLOBAL_THROTTLE_TTL ?? '6000'),
          limit: Number.parseInt(process.env.GLOBAL_THROTTLE_LIMIT ?? '100'),
        },
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const keyv = new Keyv({
          store: new KeyvRedis({
            url: `redis://${config.getOrThrow('REDIS_HOST')}:${config.getOrThrow('REDIS_PORT')}`,
          }),
          ttl: Number.parseInt(config.get('REDIS_TTL') || '600') * 1000,
        });
        
        return {
          store: keyv,
        };
      },
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    StorageModule,
    CustomCacheModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
