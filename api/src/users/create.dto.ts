import { IsString, IsInt, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  last_name: string;

  @IsString()
  first_name: string;

  @IsString()
  @IsOptional()
  patronymic?: string;

  @IsString()
  login: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsInt()
  role_id: number;
}