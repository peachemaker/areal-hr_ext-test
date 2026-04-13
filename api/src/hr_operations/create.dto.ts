import { IsInt, IsString, IsOptional, IsNumber, IsDateString, Length, IsNotEmpty } from 'class-validator';

export class CreateHrOperationDto {
  @IsInt({ message: 'ID сотрудника должен быть числом' })
  @IsNotEmpty({ message: 'ID сотрудника обязателен' })
  employee_id: number;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  action_type: string;

  @IsInt()
  @IsOptional()
  department_id?: number;

  @IsInt()
  @IsOptional()
  position_id?: number;

  @IsNumber({}, { message: 'Зарплата должна быть числом' })
  @IsOptional()
  salary: number;

  @IsDateString({}, { message: 'Неверный формат даты (ISO 8601)' })
  @IsOptional()
  operation_date?: string;
}