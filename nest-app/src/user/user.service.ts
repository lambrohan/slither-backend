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

  async getAllUsers(): Promise<
    {
      id: string;
      walletaddress: string;
      date_joined: Date;
      balance: number;
      won: number;
      lost: number;
    }[]
  > {
    return await this.prisma.$queryRaw`
      select u.id as id, u.public_address as walletAddress, u.created_at as date_joined, W.amount as balance, count(nullif(gs.won, false)) as won, count(nullif(gs.won = false, false)) as lost  from "User" u left join "GameSession" GS on u.id = GS.user_id left join "Wallet" W on u.id = W.user_id
group by w.amount, u.id, u.public_address, u.created_at, u.public_address, u.id, W.amount order by u.created_at desc ;
    `;
  }
}
