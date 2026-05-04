import { IsInt, IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';

export class CreateChangeHistoryDto {
  @IsInt()
  @IsOptional()
  user_id?: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  target?: string;

  @IsInt()
  @IsNotEmpty()
  target_id?: number;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  field_name?: string;

  @IsString()
  @IsOptional()
  old_value: string | null;

  @IsString()
  @IsOptional()
  new_value: string | null;
}