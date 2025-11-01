import { IsUUID, IsOptional } from 'class-validator';

export class CancelSubscriptionDto {
  @IsUUID()
  subscriberId: string;

  @IsOptional()
  @IsUUID()
  targetUserId?: string;

  @IsOptional()
  @IsUUID()
  publicationId?: string;
}
