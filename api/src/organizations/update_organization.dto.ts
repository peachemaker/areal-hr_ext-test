import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create_organization.dto';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}