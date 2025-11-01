import { IsUUID, IsOptional, IsIn } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  subscriberId: string;

  @IsOptional()
  @IsUUID()
  targetUserId?: string;

  @IsOptional()
  @IsUUID()
  publicationId?: string;

  @IsIn(['USER', 'PUBLICATION'])
  type: 'USER' | 'PUBLICATION';
}
