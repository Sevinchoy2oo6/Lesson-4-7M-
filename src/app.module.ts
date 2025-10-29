import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';

// Modules
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { UploadModule } from './module/upload/upload.module';
import { PostModule } from './module/post/post.module';
import { CommentModule } from './module/comment/comment.module';

// Entities
import { User } from './shared/entities/user.entity';
import { Auth } from './shared/entities/auth.entity';
import { Post } from './shared/entities/post.entity';
import { Comment } from './shared/entities/comment.entity';

// Pipes & Guards
import { ValidationPipe } from './validation/validation.pipe';
import { AuthGuard } from './shared/guards/auth.guard';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 daqiqa 
        limit: 10,  // 1 daqiqada maksimal 10 ta so‘rov
      },
    ]),

    // Database connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '0303',
      database: process.env.DB_NAME || 'postgres',
      entities: [User, Auth, Post, Comment],
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    }),

    // Application modules
    AuthModule,
    UserModule,
    UploadModule,
    PostModule,
    CommentModule,
  ],

  controllers: [],

  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
