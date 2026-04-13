import { IsString, IsInt, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateFileDto {
  @IsInt({ message: 'ID сотрудника должен быть числом' })
  @IsNotEmpty({ message: 'ID сотрудника обязателен' })
  employee_id?: number;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 500)
  path?: string;
}