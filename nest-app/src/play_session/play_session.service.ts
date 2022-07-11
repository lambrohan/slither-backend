import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TxnType } from '@prisma/client';
import { RoomService } from 'src/room/room.service';
import { TxnService } from 'src/txn/txn.service';
import { UserService } from 'src/user/user.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ConversionService } from 'src/web3/conversion.service';
import { InitSessionDto } from './dto/init-session.dto';
import { v4 as uuid } from 'uuid';
import { PrismaService } from 'src/prisma.service';
import { EndSessionDto } from './dto/end-session.dto';

@Injectable()
export class PlaySessionService {
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly conversionService: ConversionService,
    private readonly txnService: TxnService,
    private readonly prisma: PrismaService,
  ) {}

  async initSession(initDto: InitSessionDto) {
    //get user
    const user = await this.userService.findWithPubAddr(initDto.publicAddress);
    if (!user) throw new NotFoundException('user not found');

    // get and check room
    const room = await this.roomService.findByName(initDto.roomName);
    if (!room) throw new NotFoundException('room not found');

    if (initDto.stakeAmtUsd < room.min_usd_to_join)
      throw new BadRequestException(
        `min stake of $${room.min_usd_to_join} required`,
      );
    if (initDto.stakeAmtUsd > room.max_usd_to_join) {
      throw new BadRequestException(
        `max stake of $${room.max_usd_to_join} allowed`,
      );
    }

    // check if user have enough wallet balance
    const wallet = await this.walletService.getByUserId(user.id);
    if (!wallet) throw new NotFoundException('wallet not found');
    const usdRate = await this.conversionService.usdRateForBabyDoge();
    const stakeUSD = room.variable_stake
      ? initDto.stakeAmtUsd || 0
      : room.min_usd_to_join;

    const stakeBabyDoge = Math.round(stakeUSD / usdRate);
    console.log(stakeBabyDoge);
    if (wallet.amount < stakeBabyDoge) {
      throw new BadRequestException('insufficient wallet balance');
    }

    // create a stake txn
    const sessionId = uuid();
    await this.txnService.create({
      type: TxnType.STAKE,
      amount: stakeBabyDoge,
      session_id: sessionId,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    // reduce tokens from wallet
    await this.walletService.decrementTokens(stakeBabyDoge, user.id);

    // create a gamesession
    return await this.prisma.gameSession.create({
      data: {
        id: sessionId,
        tokens_staked: stakeBabyDoge,
        nickname: initDto.nickname,
        user: {
          connect: {
            id: user.id,
          },
        },
        room: {
          connect: {
            id: room.id,
          },
        },
      },
    });
  }

  async endSession(dto: EndSessionDto) {
    dto.tokensEarned = dto.tokensEarned * Math.pow(10, 6);
    const sessionExists = await this.prisma.gameSession.findUnique({
      where: {
        id: dto.sessionId,
      },
    });
    if (!sessionExists) throw new NotFoundException('session not found');
    if (sessionExists.finished_at !== null)
      throw new BadRequestException('session already ended');
    // end session
    await this.prisma.gameSession.update({
      where: {
        id: sessionExists.id,
      },
      data: {
        won: dto.won,
        kills: dto.kills,
        tokens_earned: dto.tokensEarned,
        finished_at: dto.finishedAt,
        snake_length: dto.snake_length,
        rank: dto.rank,
      },
    });

    if (dto.won) {
      // create a earning txn
      await this.txnService.create({
        type: TxnType.EARNING,
        session_id: sessionExists.id,
        amount: dto.tokensEarned,
        user: {
          connect: {
            id: sessionExists.user_id,
          },
        },
      });

      // update wallet
      await this.walletService.incrementTokens(
        dto.tokensEarned,
        sessionExists.user_id,
      );
    }

    return {
      status: 'success',
      sessionId: sessionExists.id,
    };
  }

  async getAll() {
    return await this.prisma.gameSession.findMany({
      orderBy: {
        started_at: 'desc',
      },
    });
  }

  async getById(id: string) {
    return await this.prisma.gameSession.findUnique({
      where: {
        id,
      },
    });
  }
}
