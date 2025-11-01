import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ClapService } from './clap.service';
import { CreateClapDto } from './dto/create-clap.dto';

@Controller('claps')
export class ClapController {
  constructor(private readonly clapService: ClapService) {}

  @Post()
  create(@Body() dto: CreateClapDto) {
    return this.clapService.create(dto);
  }

  @Get()
  findAll() {
    return this.clapService.findAll();
  }

  @Get('count/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.clapService.findByPost(postId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.clapService.findByUser(userId);
  }
}
