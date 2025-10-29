import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Guli', description: 'Username for the new user' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'guli@example.com', description: 'Email address for the new user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Password (minimum 6 characters)' })
  @MinLength(6)
  password: string;
}
