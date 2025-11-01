import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Highlight } from '../../shared/entities/highlight.entity';
import { User } from '../../shared/entities/user.entity';
import { Post } from '../../shared/entities/post.entity';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

@Injectable()
export class HighlightService {
  constructor(
    @InjectRepository(Highlight)
    private readonly highlightRepo: Repository<Highlight>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async create(dto: CreateHighlightDto) {
    const user = await this.userRepo.findOneBy({ id: dto.userId });
    const post = await this.postRepo.findOneBy({ id: dto.postId });

    if (!user) throw new NotFoundException('User not found');
    if (!post) throw new NotFoundException('Post not found');

    const highlight = this.highlightRepo.create({
      user,
      post,
      text: dto.text,
      note: dto.note,
    });

    const saved = await this.highlightRepo.save(highlight);
    return { message: 'Highlight created successfully', highlight: saved };
  }

  async findAll() {
    return this.highlightRepo.find({
      relations: ['user', 'post'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    return this.highlightRepo.find({
      where: { user: { id: userId } },
      relations: ['post'],
    });
  }

  async findByPost(postId: string) {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post not found');

    return this.highlightRepo.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }

  async update(id: string, dto: UpdateHighlightDto) {
    const highlight = await this.highlightRepo.findOneBy({ id });
    if (!highlight) throw new NotFoundException('Highlight not found');

    Object.assign(highlight, dto);
    const updated = await this.highlightRepo.save(highlight);

    return { message: 'Highlight updated successfully', highlight: updated };
  }

  async remove(id: string) {
    const highlight = await this.highlightRepo.findOneBy({ id });
    if (!highlight) throw new NotFoundException('Highlight not found');

    await this.highlightRepo.remove(highlight);
    return { message: 'Highlight removed successfully' };
  }
}
