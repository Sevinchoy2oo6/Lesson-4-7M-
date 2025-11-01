import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../../shared/entities/follow.entity';
import { User } from '../../shared/entities/user.entity';
import { CreateFollowDto } from './dto/create-follow.dto';
import { RemoveFollowDto } from './dto/remove-follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  //FOLLOW qo‘shish
  async followUser(dto: CreateFollowDto) {
    if (dto.followerId === dto.followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.userRepo.findOneBy({ id: dto.followerId });
    const following = await this.userRepo.findOneBy({ id: dto.followingId });

    if (!follower || !following) throw new NotFoundException('User not found');

    const existing = await this.followRepo.findOne({
      where: { follower: { id: dto.followerId }, following: { id: dto.followingId } },
      relations: ['follower', 'following'],
    });

    if (existing) throw new BadRequestException('Already following this user');

    const follow = this.followRepo.create({ follower, following });
    const saved = await this.followRepo.save(follow);

    return { message: 'Followed successfully', follow: saved };
  }

  //FOLLOW o‘chirish
  async unfollowUser(dto: RemoveFollowDto) {
    const existing = await this.followRepo.findOne({
      where: { follower: { id: dto.followerId }, following: { id: dto.followingId } },
      relations: ['follower', 'following'],
    });

    if (!existing) throw new NotFoundException('Follow not found');

    await this.followRepo.remove(existing);
    return { message: 'Unfollowed successfully' };
  }

  //Foydalanuvchining kimni kuzatayotganini olish
  async getFollowing(userId: string) {
    const follows = await this.followRepo.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    return follows.map(f => f.following);
  }

  //Foydalanuvchini kimlar kuzatayotganini olish
  async getFollowers(userId: string) {
    const followers = await this.followRepo.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });

    return followers.map(f => f.follower);
  }

  //Kuzatuvchilar soni
  async getFollowStats(userId: string) {
    const followers = await this.followRepo.count({ where: { following: { id: userId } } });
    const following = await this.followRepo.count({ where: { follower: { id: userId } } });
    return { followers, following };
  }
}
