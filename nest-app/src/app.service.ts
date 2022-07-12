import { Injectable } from '@nestjs/common';
import { UserDashInfo } from './common/interfaces/DashInfo.dto';
import { TxnAdminInfo } from './common/interfaces/TxnAdminInfo.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return 'pong';
  }

  async getUserDashData(uid: string): Promise<UserDashInfo> {
    const allSessions = await this.prisma.gameSession.findMany({
      where: {
        user_id: uid,
      },
      orderBy: {
        started_at: 'desc',
      },
    });
    let bestCareerHigh = allSessions.length ? 1000000 : 0;
    let totalWinMatches = 0;
    let totalLossMatches = 0;
    let earnings = BigInt(0);
    let losses = BigInt(0);
    const recentRank = allSessions.length ? allSessions[0].rank : 0;

    allSessions.forEach((s) => {
      if (s.rank < bestCareerHigh) {
        bestCareerHigh = s.rank;
      }
      if (s.won) {
        totalWinMatches++;
        earnings += s.tokens_earned;
      } else {
        totalLossMatches++;
        losses += s.tokens_staked;
      }
    });

    return {
      totalWinMatches,
      totalLossMatches,
      bestCareerHigh,
      earnings,
      losses,
      recentRank,
    };
  }

  async getTxnDashData(): Promise<TxnAdminInfo> {
    const res = await this.prisma
      .$queryRaw`select sum(case when t.type = 'DEPOSIT' then t.amount else 0 end
    ) as totalDeposit, sum(case when t.type = 'WITHDRAW' then t.amount else 0 end
    ) as totalWithdraw from "Transaction" t;`;

    if (res && res[0]) {
      return res[0];
    }
  }
}
