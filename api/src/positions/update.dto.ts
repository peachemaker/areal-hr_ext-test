import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from './create.dto';

export class UpdatePositionDto extends PartialType(CreatePositionDto) {}