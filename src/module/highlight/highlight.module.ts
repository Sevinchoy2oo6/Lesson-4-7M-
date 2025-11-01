import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Highlight } from '../../shared/entities/highlight.entity';
import { User } from '../../shared/entities/user.entity';
import { Post } from '../../shared/entities/post.entity';
import { HighlightService } from './highlight.service';
import { HighlightController } from './highlight.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Highlight, User, Post])],
  controllers: [HighlightController],
  providers: [HighlightService],
})
export class HighlightModule {}
