import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  create(@Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.create(dto);
  }

  @Get()
  findAll() {
    return this.bookmarkService.findAll();
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.bookmarkService.findByUser(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarkService.remove(id);
  }
}
