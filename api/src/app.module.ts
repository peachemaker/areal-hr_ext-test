import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';
import { DatabaseModule } from './database/database.module';
import { OrganizationsModule } from './organizations/organization.module';
import { DepartmentsModule } from './departments/department.module';
import { PositionsModule } from './positions/position.module';
import { EmployeesModule } from './employees/employee.module';
import { FilesModule } from './files/file.module';
import { HrOperationsModule } from './hr_operations/hr_op.module';
import { ChangeHistoryModule } from './change_history/change_history.module';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../.env'),
      isGlobal: true,
    }),
    DatabaseModule,
    OrganizationsModule,
    DepartmentsModule,
    PositionsModule,
    EmployeesModule,
    FilesModule,
    HrOperationsModule,
    ChangeHistoryModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
