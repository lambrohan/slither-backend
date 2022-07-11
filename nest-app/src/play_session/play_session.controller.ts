import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AdminAuthGuard } from 'src/auth/admin.guard';
import { ColyseusBackendOnly } from 'src/auth/colyseusonly.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { EndSessionDto } from './dto/end-session.dto';
import { InitSessionDto } from './dto/init-session.dto';
import { PlaySessionService } from './play_session.service';

@ApiTags('PlaySession')
@Controller('play-session')
export class PlaySessionController {
  constructor(private readonly playSessionService: PlaySessionService) {}

  @Post('/init')
  @UseGuards(ColyseusBackendOnly) // only request from colyseus backend are allowed
  @ApiBearerAuth()
  @Public() // skips main auth middleware with jwt
  async create(@Body() initDto: InitSessionDto) {
    return await this.playSessionService.initSession(initDto);
  }

  @Post('/end')
  @Public() // skips main auth middleware with jwt
  @UseGuards(ColyseusBackendOnly) // only request from colyseus backend are allowed
  @ApiBearerAuth()
  async endSession(@Body() endDto: EndSessionDto) {
    return await this.playSessionService.endSession(endDto);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  async getAll() {
    return await this.playSessionService.getAll();
  }

  @Get('/:id')
  @ApiBearerAuth()
  async getById(@GetUser() user: User, @Param('id') id: string) {
    const session = await this.playSessionService.getById(id);
    if (user.is_admin || user.id === session.user_id) {
      return session;
    }
    return new UnauthorizedException();
  }
}
