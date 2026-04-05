import { Module } from '@nestjs/common';
import { DepartmentsController } from './department.controller';
import { DepartmentsService } from './department.service';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}