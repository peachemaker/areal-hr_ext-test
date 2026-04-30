import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
  Request,
  BadRequestException
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './create.dto';
import { UpdateUserDto } from './update.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(AuthenticatedGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Roles(1)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const currentUser = req.user;
    if (currentUser && currentUser.id === id) {
      throw new BadRequestException(
        'Вы не можете удалить свою собственную учетную запись',
      );
    }
    return this.usersService.remove(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
