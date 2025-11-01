import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateHighlightDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  postId: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  note?: string;
}
