import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { HrOperationsService } from './hr_op.service';
import { CreateHrOperationDto } from './create.dto';
import { UpdateHrOperationDto } from './update.dto';

@Controller('hr-operations')
export class HrOperationsController {
  constructor(private readonly hrOperationsService: HrOperationsService) {}

  @Post()
  create(@Body() createHrOperationDto: CreateHrOperationDto) {
    return this.hrOperationsService.create(createHrOperationDto);
  }

  @Get()
  findAll() {
    return this.hrOperationsService.findAll();
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.hrOperationsService.findByEmployee(employeeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateHrOperationDto: UpdateHrOperationDto
  ) {
    return this.hrOperationsService.update(id, updateHrOperationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hrOperationsService.remove(id);
  }
}