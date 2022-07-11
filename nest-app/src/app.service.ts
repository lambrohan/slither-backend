import { Injectable } from '@nestjs/common';
import { UserDashInfo } from './common/interfaces/DashInfo.dto';
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
}
