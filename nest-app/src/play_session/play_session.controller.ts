import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ColyseusBackendOnly } from 'src/auth/colyseusonly.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { EndSessionDto } from './dto/end-session.dto';
import { InitSessionDto } from './dto/init-session.dto';
import { PlaySessionService } from './play_session.service';

@Public() // skips main auth middleware with jwt
@UseGuards(ColyseusBackendOnly) // only request from colyseus backend are allowed
@ApiTags('PlaySession')
@Controller('play-session')
export class PlaySessionController {
  constructor(private readonly playSessionService: PlaySessionService) {}

  @Post('/init')
  @ApiBearerAuth()
  async create(@Body() initDto: InitSessionDto) {
    return await this.playSessionService.initSession(initDto);
  }

  @Post('/end')
  @ApiBearerAuth()
  async endSession(@Body() endDto: EndSessionDto) {
    return await this.playSessionService.endSession(endDto);
  }
}
