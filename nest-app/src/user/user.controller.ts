import {
  Controller,
  Get,
  Post,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import * as Web3Token from 'web3-token';
import { User } from './entities/user.entity';
import { WalletService } from 'src/wallet/wallet.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}

  @Post()
  @Public()
  @ApiBearerAuth()
  async create(@Request() req) {
    try {
      const [a, token] = req.headers.authorization.split('Bearer ');
      const user = await Web3Token.verify(token);
      const userExists = await this.userService.findWithPubAddr(user.address);
      if (userExists) {
        return userExists;
      }
      if (user && user.address) {
        const createdUser = await this.userService.create({
          public_address: user.address,
        });

        await this.walletService.init(createdUser.id);

        return createdUser;
      }
    } catch (error) {
      return new BadRequestException(error.message);
    }

    return new BadRequestException();
  }

  // @Get(':pub_addr')
  // findOne(@Param('pub_addr') pub_addr: string) {
  //   return this.userService.findWithPubAddr(pub_addr);
  // }

  @Get('me')
  @ApiBearerAuth()
  async me(@GetUser() user: User) {
    return await this.userService.getFullUser(user.public_address);
  }
}
