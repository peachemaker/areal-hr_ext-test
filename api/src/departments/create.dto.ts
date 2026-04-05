import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDepartmentDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  organization_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  parent_department_id?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  comment?: string;
}