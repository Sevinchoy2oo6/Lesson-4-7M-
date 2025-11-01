import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from '../../shared/entities/follow.entity';
import { User } from '../../shared/entities/user.entity';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
