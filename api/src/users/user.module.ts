import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { ChangeHistoryModule } from '../change_history/change_history.module';

@Module({
  imports: [ChangeHistoryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}