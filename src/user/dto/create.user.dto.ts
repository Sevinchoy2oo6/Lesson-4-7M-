import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Guli', description: 'Username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'guli@example.com', description: 'Email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'User password (at least 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;
}
