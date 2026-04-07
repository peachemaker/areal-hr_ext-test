import {
  IsString,
  IsOptional,
  IsDateString,
  Length,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty({ message: 'Фамилия обязательна' })
  @Length(1, 100)
  last_name?: string;

  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно' })
  @Length(1, 100)
  first_name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  patronymic?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Неверный формат даты (ISO 8601)' })
  birth_date?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}$/, { message: 'Серия паспорта должна состоять из 4 цифр' })
  passport_series?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Номер паспорта должен состоять из 6 цифр' })
  passport_number?: string;

  @IsOptional()
  @IsDateString()
  passport_issue_date?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  passport_department_code?: string;

  @IsOptional()
  @IsString()
  passport_issued_by?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  address_region?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  address_locality?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  address_street?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  address_house?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  address_block?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  address_apartment?: string;
}
