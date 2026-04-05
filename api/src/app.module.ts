import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';
import { DatabaseModule } from './database/database.module';
import { OrganizationsModule } from './organizations/organization.module';
import { DepartmentsModule } from './departments/department.module';
import { PositionsModule } from './positions/position.module';

@Module({
  imports: [ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../.env'),
      isGlobal: true,
    }),
    DatabaseModule,
    OrganizationsModule,
    DepartmentsModule,
    PositionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
