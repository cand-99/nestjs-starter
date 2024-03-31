import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { prismaExclude } from 'src/helper/prismaExluce';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserWithoutPassword } from './interface/IUserWithoutPassword';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/helper/paginator';
import { UpdateUserDto } from './dto/update-user.dto';

const paginate: PaginateFunction = paginator({ pageSize: 10 });
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    const { password, email } = createUserDto;
    const emailExist = await this.findByEmail(email);
    if (emailExist) {
      throw new BadRequestException(`email ${email} already taken`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserWithoutPassword> {
    const { email } = updateUserDto;

    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException(`User id ${id} not found`);
    }

    if (user.email !== email) {
      const emailExist = await this.findByEmail(email);
      if (emailExist) {
        throw new BadRequestException(`email ${email} already taken`);
      }
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      select: prismaExclude('User', ['password']),
    });
  }

  async findMany({
    orderBy,
    page,
    pageSize,
    where,
  }: {
    orderBy?: Prisma.UserOrderByWithRelationInput;
    page?: number;
    pageSize?: number;
    where?: Prisma.UserWhereInput;
  }): Promise<PaginatedResult<IUserWithoutPassword>> {
    return paginate(
      this.prisma.user,
      {
        where,
        orderBy,
        select: prismaExclude('User', ['password']),
      },
      { page, pageSize },
    );
  }

  findOne(id: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findOneWithoutPassword(
    id: string,
  ): Promise<IUserWithoutPassword | undefined> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: prismaExclude('User', ['password']),
    });
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
