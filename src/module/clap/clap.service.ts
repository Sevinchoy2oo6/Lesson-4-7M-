import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Clap } from '../../shared/entities/clap.entity';
import { User } from '../../shared/entities/user.entity';
import { Post } from '../../shared/entities/post.entity';
import { CreateClapDto } from './dto/create-clap.dto';

@Injectable()
export class ClapService {
  constructor(
    @InjectRepository(Clap)
    private readonly clapRepo: Repository<Clap>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  //Yangi clap yaratish
  async create(dto: CreateClapDto) {
    const user = await this.userRepo.findOneBy({ id: dto.userId });
    const post = await this.postRepo.findOneBy({ id: dto.postId });

    if (!user) throw new NotFoundException('User not found');
    if (!post) throw new NotFoundException('Post not found');

    //Foydalanuvchi oldin clap qo‘ygani-yo‘qligini tekshirish
    const where: FindOptionsWhere<Clap> = {
      user: { id: dto.userId } as any,
      post: { id: dto.postId } as any,
    };

    const existing = await this.clapRepo.findOne({
      where,
      relations: ['user', 'post'],
    });

    if (existing) {
      return { message: 'User already clapped this post' };
    }

    const clap = this.clapRepo.create({ user, post });
    const saved = await this.clapRepo.save(clap);

    return { message: 'Clap added successfully', clap: saved };
  }

  //Barcha claplarni olish
  async findAll() {
    return this.clapRepo.find({
      relations: ['user', 'post'],
      order: { created_at: 'DESC' },
    });
  }

  //Muayyan postdagi claplar soni
  async findByPost(postId: string) {
    const where: FindOptionsWhere<Clap> = {
      post: { id: postId } as any,
    };

    const count = await this.clapRepo.count({ where });
    return { postId, claps: count };
  }

  //User tomonidan qo‘yilgan claplarni olish
  async findByUser(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const where: FindOptionsWhere<Clap> = {
      user: { id: userId } as any,
    };

    const claps = await this.clapRepo.find({
      where,
      relations: ['post'],
    });

    return { userId, total: claps.length, claps };
  }

  //Clapni o‘chirish
  async remove(id: string) {
    const clap = await this.clapRepo.findOneBy({ id });
    if (!clap) throw new NotFoundException('Clap not found');

    await this.clapRepo.remove(clap);
    return { message: 'Clap removed successfully' };
  }
}

