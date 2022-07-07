import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(
    createUserDto: Prisma.UserCreateInput,
  ): Promise<Prisma.Prisma__UserClient<User>> {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findWithPubAddr(pub_addr: string) {
    return await this.prisma.user.findUnique({
      where: {
        public_address: pub_addr,
      },
    });
  }

  async getFullUser(pub_addr: string) {
    return await this.prisma.user.findUnique({
      where: {
        public_address: pub_addr,
      },
      include: {
        wallet: true,
      },
    });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        wallet: true,
      },
    });
  }
}
