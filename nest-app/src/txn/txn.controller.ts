import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TxnType } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { getBabyDogeFromTxn } from 'src/utils';
import { WalletService } from 'src/wallet/wallet.service';
import { Web3Service } from 'src/web3/web3.service';
import { WithdrawTokenDto } from './dto/withdraw.dto';
import { TxnService } from './txn.service';

@Controller('txn')
@ApiTags('transactions')
export class TxnController {
  constructor(
    private readonly txnService: TxnService,
    private readonly web3Service: Web3Service,
    private readonly walletService: WalletService,
  ) {}

  @Get('/deposit/:id')
  @ApiBearerAuth()
  async create(@Param('id') id: string, @GetUser() user: User) {
    const depositInfo = await this.web3Service.getTxnDetailsFromDepositId(id);
    if (!depositInfo) throw new BadRequestException('txn not found');

    if (depositInfo.user.toLowerCase() !== user.public_address.toLowerCase()) {
      return new UnauthorizedException();
    }

    const babyDogeToAdd = getBabyDogeFromTxn(depositInfo);

    if (babyDogeToAdd <= 0) {
      throw new BadRequestException(`invalid token amount ${babyDogeToAdd}`);
    }

    const txn = await this.txnService.create({
      type: TxnType.DEPOSIT,
      deposit_id: id,
      amount: babyDogeToAdd,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    await this.walletService.incrementTokens(babyDogeToAdd, user.id);

    return {
      status: 'success',
      ...txn,
    };
  }

  @Post('/withdraw')
  @ApiBearerAuth()
  async withdrawToken(@Body() dto: WithdrawTokenDto, @GetUser() user: User) {
    const wallet = await this.walletService.getByUserId(user.id);
    if (!wallet) throw new NotFoundException('wallet not found');
    if (dto.amount > wallet.amount) {
      throw new BadRequestException('insufficient wallet balance');
    }

    // send baby doge to user address
    await this.web3Service.sendTokensToUser(user.public_address, dto.amount);

    return wallet;

    // create a withdraw txn
    const txn = await this.txnService.create({
      // TODO add hash for txn later
      type: TxnType.WITHDRAW,
      amount: dto.amount,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    // update wallet balance
    await this.walletService.decrementTokens(dto.amount, user.id);

    return txn;
  }
}
