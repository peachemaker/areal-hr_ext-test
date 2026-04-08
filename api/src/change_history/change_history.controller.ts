import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChangeHistoryService } from './change_history.service';
import { CreateChangeHistoryDto } from './create.dto';

@Controller('change-history')
export class ChangeHistoryController {
  constructor(private readonly changeHistoryService: ChangeHistoryService) {}

  @Post()
  create(@Body() createChangeHistoryDto: CreateChangeHistoryDto) {
    return this.changeHistoryService.create(createChangeHistoryDto);
  }

  @Get()
  findAll() {
    return this.changeHistoryService.findAll();
  }

  @Get('target')
  findByTarget(
    @Query('table') target: string,
    @Query('id', ParseIntPipe) targetId: number,
  ) {
    return this.changeHistoryService.findByTarget(target, targetId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.changeHistoryService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.changeHistoryService.findOne(id);
  }
}