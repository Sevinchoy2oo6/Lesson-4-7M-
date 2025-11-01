import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';

// Shared Entities
import { User } from './shared/entities/user.entity';
import { Auth } from './shared/entities/auth.entity';
import { Post } from './shared/entities/post.entity';
import { Comment } from './shared/entities/comment.entity';
import { Tag } from './shared/entities/tag.entity';
import { Publication } from './shared/entities/publication.entity';
import { Highlight } from './shared/entities/highlight.entity';
import { Clap } from './shared/entities/clap.entity';
import { Bookmark } from './shared/entities/bookmark.entity';
import { Follow } from './shared/entities/follow.entity';
import { Subscription } from './shared/entities/subscription.entity';

// App Modules
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { UploadModule } from './module/upload/upload.module';
import { PostModule } from './module/post/post.module';
import { CommentModule } from './module/comment/comment.module';
import { TagModule } from './module/tag/tag.module';
import { PublicationModule } from './module/publication/publication.module';
import { HighlightModule } from './module/highlight/highlight.module';
import { ClapModule } from './module/clap/clap.module';
import { BookmarkModule } from './module/bookmark/bookmark.module';
import { FollowModule } from './module/follow/follow.module';
import { SubscriptionModule } from './module/subscription/subscription.module';

// Pipes & Guards
import { ValidationPipe } from './validation/validation.pipe';
import { AuthGuard } from './shared/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 daqiqa
        limit: 10, // 1 daqiqada 10 ta so‘rov
      },
    ]),

    //Database connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '0303',
      database: process.env.DB_NAME || 'postgres',
      entities: [
        User,
        Auth,
        Post,
        Comment,
        Tag,
        Publication,
        Highlight,
        Clap,
        Bookmark,
        Follow,
        Subscription,
      ],
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    }),

    //Application modules
    AuthModule,
    UserModule,
    UploadModule,
    PostModule,
    CommentModule,
    TagModule,
    PublicationModule,
    HighlightModule,
    ClapModule,
    BookmarkModule,
    FollowModule,
    SubscriptionModule,
  ],

  //Global Pipes & Guards
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule { }
