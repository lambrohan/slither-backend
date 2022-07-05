import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomDto } from './dto/createRoom.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoomDto) {
    return await this.prisma.gameRoom.create({
      data: dto,
    });
  }

  async findById(id: string) {
    return await this.prisma.gameRoom.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string) {
    return await this.prisma.gameRoom.findUnique({
      where: {
        name,
      },
    });
  }
  async findAll() {
    return await this.prisma.gameRoom.findMany();
  }
}
