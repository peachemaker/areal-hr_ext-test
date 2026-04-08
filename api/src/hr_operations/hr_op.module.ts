import { Module } from '@nestjs/common';
import { HrOperationsService } from './hr_op.service';
import { HrOperationsController } from './hr_op.controller';

@Module({
  controllers: [HrOperationsController],
  providers: [HrOperationsService],
})
export class HrOperationsModule {}