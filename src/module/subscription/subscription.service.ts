import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../shared/entities/subscription.entity';
import { User } from '../../shared/entities/user.entity';
import { Publication } from '../../shared/entities/publication.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Publication)
    private readonly pubRepo: Repository<Publication>,
  ) {}

  //SUBSCRIBE qilish
  async subscribe(dto: CreateSubscriptionDto) {
    const subscriber = await this.userRepo.findOne({
      where: { id: dto.subscriberId },
    });
    if (!subscriber) throw new NotFoundException('Subscriber not found');

    let targetUserEntity: User | null = null;
    let publicationEntity: Publication | null = null;

    if (dto.type === 'USER') {
      if (!dto.targetUserId)
        throw new BadRequestException('Target user ID is required');
      const foundUser = await this.userRepo.findOne({
        where: { id: dto.targetUserId },
      });
      if (!foundUser) throw new NotFoundException('Target user not found');
      targetUserEntity = foundUser;
    } else {
      if (!dto.publicationId)
        throw new BadRequestException('Publication ID is required');
      const foundPublication = await this.pubRepo.findOne({
        where: { id: dto.publicationId },
      });
      if (!foundPublication)
        throw new NotFoundException('Publication not found');
      publicationEntity = foundPublication;
    }

    const existing = await this.subRepo.findOne({
      where: {
        subscriber: { id: dto.subscriberId },
        ...(dto.type === 'USER'
          ? { targetUser: { id: dto.targetUserId } }
          : { publication: { id: dto.publicationId } }),
      },
      relations: ['subscriber', 'targetUser', 'publication'],
    });

    if (existing)
      throw new BadRequestException('Already subscribed to this target');

    const newSub = this.subRepo.create({
  subscriber,
  ...(targetUserEntity ? { targetUser: targetUserEntity } : {}),
  ...(publicationEntity ? { publication: publicationEntity } : {}),
  type: dto.type,
});

    const saved = await this.subRepo.save(newSub);
    return { message: 'Subscribed successfully', subscription: saved };
  }

  //SUBSCRIBE bekor qilish
  async cancel(dto: CancelSubscriptionDto) {
    const existing = await this.subRepo.findOne({
      where: {
        subscriber: { id: dto.subscriberId },
        ...(dto.targetUserId
          ? { targetUser: { id: dto.targetUserId } }
          : { publication: { id: dto.publicationId } }),
      },
      relations: ['subscriber', 'targetUser', 'publication'],
    });

    if (!existing) throw new NotFoundException('Subscription not found');

    await this.subRepo.remove(existing);
    return { message: 'Subscription cancelled successfully' };
  }

  //USER yoki PUBLICATION uchun barcha subscriber’larni olish
  async getSubscribers(type: 'USER' | 'PUBLICATION', id: string) {
    const where =
      type === 'USER' ? { targetUser: { id } } : { publication: { id } };

    const subs = await this.subRepo.find({
      where,
      relations: ['subscriber'],
    });

    return subs.map((s) => s.subscriber);
  }

  //USER ning kimlarga obuna bo‘lganini olish
  async getUserSubscriptions(userId: string) {
    const subs = await this.subRepo.find({
      where: { subscriber: { id: userId } },
      relations: ['targetUser', 'publication'],
    });

    return subs;
  }
}
