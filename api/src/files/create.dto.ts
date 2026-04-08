import { IsString, IsInt, IsNotEmpty, Length } from 'class-validator';

export class CreateFileDto {
  @IsInt({ message: 'ID сотрудника должен быть числом' })
  @IsNotEmpty({ message: 'ID сотрудника обязателен' })
  employee_id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Имя файла обязательно' })
  @Length(1, 255)
  name?: string;

  @IsString()
  @IsNotEmpty({ message: 'Путь к файлу обязателен' })
  @Length(1, 500)
  path?: string;
}