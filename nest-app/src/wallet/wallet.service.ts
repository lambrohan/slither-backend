import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async incrementTokens(amt: number, userId: string) {
    return await this.prisma.wallet.update({
      where: {
        user_id: userId,
      },
      data: {
        amount: {
          increment: amt,
        },
      },
    });
  }

  async decrementTokens(amt: number, userId: string) {
    return await this.prisma.wallet.updateMany({
      where: {
        user_id: userId,
        amount: {
          gt: 0,
        },
      },
      data: {
        amount: {
          increment: amt * -1,
        },
      },
    });
  }

  async init(userId: string) {
    return await this.prisma.wallet.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getByUserId(uid: string) {
    return await this.prisma.wallet.findUnique({
      where: {
        user_id: uid,
      },
    });
  }
}
