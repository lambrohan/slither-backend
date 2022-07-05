import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TxnService {
  constructor(private prisma: PrismaService) {}

  async findAllWithUserId(userId: string) {
    return await this.prisma.transaction.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async create(data: Prisma.TransactionCreateInput) {
    return await this.prisma.transaction.create({
      data,
    });
  }

  async findByHash(hash: string) {
    return await this.prisma.transaction.findFirst({
      where: {
        hash,
      },
    });
  }
}
