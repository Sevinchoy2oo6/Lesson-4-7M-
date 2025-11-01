import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { RemoveFollowDto } from './dto/remove-follow.dto';

@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  followUser(@Body() dto: CreateFollowDto) {
    return this.followService.followUser(dto);
  }

  @Delete()
  unfollowUser(@Body() dto: RemoveFollowDto) {
    return this.followService.unfollowUser(dto);
  }

  @Get(':userId/followers')
  getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(userId);
  }

  @Get(':userId/stats')
  getStats(@Param('userId') userId: string) {
    return this.followService.getFollowStats(userId);
  }
}
