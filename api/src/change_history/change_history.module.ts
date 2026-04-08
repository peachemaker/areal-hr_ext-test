import { Module } from '@nestjs/common';
import { ChangeHistoryService } from './change_history.service';
import { ChangeHistoryController } from './change_history.controller';

@Module({
  controllers: [ChangeHistoryController],
  providers: [ChangeHistoryService],
})
export class ChangeHistoryModule {}