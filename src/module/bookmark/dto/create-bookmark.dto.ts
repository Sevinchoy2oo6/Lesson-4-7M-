import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookmarkDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  postId: string;
}
