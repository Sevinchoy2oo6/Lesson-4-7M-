import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { HighlightService } from './highlight.service';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

@Controller('highlights')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) {}

  @Post()
  create(@Body() dto: CreateHighlightDto) {
    return this.highlightService.create(dto);
  }

  @Get()
  findAll() {
    return this.highlightService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.highlightService.findByUser(userId);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.highlightService.findByPost(postId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHighlightDto) {
    return this.highlightService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.highlightService.remove(id);
  }
}
