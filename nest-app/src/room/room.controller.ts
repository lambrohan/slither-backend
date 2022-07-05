import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/admin.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateRoomDto } from './dto/createRoom.dto';
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
}
