import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clap } from '../../shared/entities/clap.entity';
import { User } from '../../shared/entities/user.entity';
import { Post } from '../../shared/entities/post.entity';
import { ClapService } from './clap.service';
import { ClapController } from './clap.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Clap, User, Post])],
  controllers: [ClapController],
  providers: [ClapService],
  exports: [ClapService],
})
export class ClapModule {}
