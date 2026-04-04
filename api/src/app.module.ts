import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';

@Module({
  imports: [ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../.env'),
      isGlobal: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
