import { Module, Global } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';

@Global()
@Module({
  providers: [DatabaseProvider],
  exports: ['PG_POOL'],
})
export class DatabaseModule {}