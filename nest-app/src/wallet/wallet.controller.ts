import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { WalletService } from './wallet.service';

@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
  constructor(private readonly wallerService: WalletService) {}

  @Get('/me')
  @ApiBearerAuth()
  async getUserWallet(@GetUser() user: User) {
    return await this.wallerService.getByUserId(user.id);
  }
}
