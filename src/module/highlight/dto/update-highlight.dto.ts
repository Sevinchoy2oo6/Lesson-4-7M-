import { IsOptional, IsString } from 'class-validator';

export class UpdateHighlightDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
