import { PartialType } from '@nestjs/mapped-types';
import { CreateClapDto } from './create-clap.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateClapDto extends PartialType(CreateClapDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
