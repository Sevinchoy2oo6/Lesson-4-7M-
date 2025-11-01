import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../shared/entities/tag.entity';
import { Post } from '../../shared/entities/post.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  //Tag yaratish
  async create(dto: CreateTagDto) {
    const tag = this.tagRepository.create(dto);
    return this.tagRepository.save(tag);
  }

  //Barcha taglarni olish
  async findAll() {
    return this.tagRepository.find({ relations: ['posts'] });
  }

  //Bitta tagni topish
  async findOne(id: string) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!tag) throw new NotFoundException(`Tag ${id} topilmadi`);
    return tag;
  }

  //Tagni yangilash
  async update(id: string, dto: UpdateTagDto) {
    const tag = await this.findOne(id);
    Object.assign(tag, dto);
    return this.tagRepository.save(tag);
  }

  //Tagni o‘chirish
  async remove(id: string) {
    const tag = await this.findOne(id);
    return this.tagRepository.remove(tag);
  }

  //Postga taglarni biriktirish
  async addTagsToPost(postId: string, tagIds: string[]) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['tags'],
    });
    if (!post) throw new NotFoundException(`Post ${postId} topilmadi`);

    const tags = await this.tagRepository.findByIds(tagIds);
    post.tags = [...(post.tags || []), ...tags];
    return this.postRepository.save(post);
  }
}
