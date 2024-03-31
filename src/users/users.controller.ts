import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { User } from '@prisma/client';
import { PaginatedResult } from 'src/helper/paginator';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserWithoutPassword } from './interface/IUserWithoutPassword';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User | undefined> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<PaginatedResult<IUserWithoutPassword>> {
    return await this.userService.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {},
      page,
      pageSize,
    });
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUserWithoutPassword> {
    return await this.userService.update(id, updateUserDto);
  }
}
