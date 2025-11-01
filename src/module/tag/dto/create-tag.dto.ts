import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @Length(2, 100)
  slug: string;
}
