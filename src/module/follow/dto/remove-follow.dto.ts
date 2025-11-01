import { IsUUID } from 'class-validator';

export class RemoveFollowDto {
  @IsUUID()
  followerId: string;

  @IsUUID()
  followingId: string;
}
