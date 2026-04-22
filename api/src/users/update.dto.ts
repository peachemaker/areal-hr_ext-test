import { IsString, IsOptional, IsInt, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  patronymic?: string;

  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не короче 6 символов' })
  password?: string;

  @IsOptional()
  @IsInt()
  role_id?: number;
}