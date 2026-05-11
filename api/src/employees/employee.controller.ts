import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EmployeesService } from './employee.service';
import { CreateEmployeeDto } from './create.dto';
import { UpdateEmployeeDto } from './update.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('employees')
@UseGuards(AuthenticatedGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('scans'))
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFiles() files: Express.Multer.File[] 
  ) {
    return this.employeesService.create(createEmployeeDto, files);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('scans'))
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFiles() files: Express.Multer.File[] 
  ) {
    return this.employeesService.update(id, updateEmployeeDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }
}