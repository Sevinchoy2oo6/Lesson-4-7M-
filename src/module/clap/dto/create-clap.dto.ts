import { IsUUID } from 'class-validator';

export class CreateClapDto {
  @IsUUID('4', { message: 'Invalid userId format' })
  userId: string;

  @IsUUID('4', { message: 'Invalid postId format' })
  postId: string;
}
