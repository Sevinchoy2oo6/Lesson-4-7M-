import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../shared/entities/comment.entity';
import { Post } from '../../shared/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    // Avval post borligini tekshiramiz
    const post = await this.postRepo.findOne({
      where: { id: createCommentDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Yangi comment yaratish
    const comment = this.commentRepo.create({
      content: createCommentDto.content,
      post: post, // bu joy muhim — to‘liq post obyektini beramiz
    });

    return this.commentRepo.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepo.find({ relations: ['post'] });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['post'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, dto);
    return this.commentRepo.save(comment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.commentRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Comment not found');
  }
}
