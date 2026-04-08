import { PartialType } from '@nestjs/mapped-types';
import { CreateHrOperationDto } from './create.dto';

export class UpdateHrOperationDto extends PartialType(CreateHrOperationDto) {}