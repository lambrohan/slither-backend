import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/admin.guard';
import { ColyseusBackendOnly } from 'src/auth/colyseusonly.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateRoomInstanceDto } from './dto/create-room-instance.dto';
import { CreateRoomDto } from './dto/createRoom.dto';
import { DestroyRoomInstanceDto } from './dto/destroy-room-instance.dto';
import { RoomService } from './room.service';

@Controller('room')
@ApiTags('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard) // allows only admin to pass through
  @Post()
  async create(@Body() dto: CreateRoomDto) {
    return await this.roomService.create(dto);
  }

  @ApiBearerAuth()
  @Public()
  @Get()
  async findAll() {
    return await this.roomService.findAll();
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(ColyseusBackendOnly)
  @Post('init')
  async createRoomInstance(@Body() dto: CreateRoomInstanceDto) {
    return await this.roomService.createInstance(dto);
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(ColyseusBackendOnly)
  @Post('dispose')
  async destroyRoomInstance(@Body() dto: DestroyRoomInstanceDto) {
    return await this.roomService.disposeInstance(dto);
  }
}
