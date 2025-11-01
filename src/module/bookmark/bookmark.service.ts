import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../../shared/entities/bookmark.entity';
import { User } from '../../shared/entities/user.entity';
import { Post } from '../../shared/entities/post.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepo: Repository<Bookmark>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  //Yangi bookmark yaratish
  async create(dto: CreateBookmarkDto) {
    const user = await this.userRepo.findOneBy({ id: dto.userId });
    const post = await this.postRepo.findOneBy({ id: dto.postId });

    if (!user) throw new NotFoundException('User not found');
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.bookmarkRepo.findOne({
      where: { user: { id: dto.userId }, post: { id: dto.postId } },
      relations: ['user', 'post'],
    });

    if (existing) {
      return { message: 'Already bookmarked' };
    }

    const bookmark = this.bookmarkRepo.create({ user, post });
    const saved = await this.bookmarkRepo.save(bookmark);

    return { message: 'Bookmark added successfully', bookmark: saved };
  }

  //Barcha bookmarklarni olish
  async findAll() {
    return this.bookmarkRepo.find({
      relations: ['user', 'post'],
      order: { createdAt: 'DESC' },
    });
  }

  //Foydalanuvchi bo‘yicha olish
  async findByUser(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const bookmarks = await this.bookmarkRepo.find({
      where: { user: { id: userId } },
      relations: ['post'],
    });

    return { userId, total: bookmarks.length, bookmarks };
  }

  // Bookmarkni o‘chirish
  async remove(id: string) {
    const bookmark = await this.bookmarkRepo.findOneBy({ id });
    if (!bookmark) throw new NotFoundException('Bookmark not found');

    await this.bookmarkRepo.remove(bookmark);
    return { message: 'Bookmark removed successfully' };
  }
}
