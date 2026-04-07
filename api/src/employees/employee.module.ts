import { Module } from '@nestjs/common';
import { EmployeesService } from './employee.service';
import { EmployeesController } from './employee.controller';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}