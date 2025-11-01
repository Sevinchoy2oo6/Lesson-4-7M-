import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { Bookmark } from '../../shared/entities/bookmark.entity';
import { User } from '../../shared/entities/user.entity';
import { Post } from '../../shared/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, User, Post])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
