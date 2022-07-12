import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AppService } from './app.service';
import { AdminAuthGuard } from './auth/admin.guard';
import { GetUser } from './common/decorators/get-user.decorator';
import { Public } from './common/decorators/public.decorator';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @Get('/dashboard/me')
  async getDashboardData(@GetUser() user: User) {
    return await this.appService.getUserDashData(user.id);
  }

  @Public()
  @UseGuards(AdminAuthGuard)
  @Get('/txnmeta')
  async getTxnMeta() {
    return await this.appService.getTxnDashData();
  }
}
