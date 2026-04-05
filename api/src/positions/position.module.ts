import { Module } from '@nestjs/common';
import { PositionsController } from './position.controller';
import { PositionsService } from './position.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}