import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomInstanceDto } from './dto/create-room-instance.dto';
import { CreateRoomDto } from './dto/createRoom.dto';
import { DestroyRoomInstanceDto } from './dto/destroy-room-instance.dto';

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

  async createInstance(dto: CreateRoomInstanceDto) {
    const room = await this.prisma.gameRoom.findUniqueOrThrow({
      where: {
        id: dto.gameRoomId,
      },
    });
    if (room.tokens < room.tokens_per_instance) {
      throw new BadRequestException('not enough tokens to create instance');
    }
    const createInstance = this.prisma.roomInstance.create({
      data: {
        colyseus_room_id: dto.colyseusRoomId,
        room: {
          connect: {
            id: room.id,
          },
        },
        tokens: room.tokens_per_instance,
      },
    });
    const updateRoomTokens = this.prisma.gameRoom.update({
      where: {
        id: room.id,
      },
      data: {
        tokens: {
          increment: -room.tokens_per_instance,
        },
      },
    });

    const r = await this.prisma.$transaction([
      createInstance,
      updateRoomTokens,
    ]);

    return r[0];
  }

  async disposeInstance(dto: DestroyRoomInstanceDto) {
    //check if room exists & not disposed
    const instance = await this.prisma.roomInstance.findUniqueOrThrow({
      where: {
        colyseus_room_id: dto.colyseusRoomId,
      },
    });

    if (instance.destroyed_at) {
      throw new UnauthorizedException('room is already disposed');
    }

    // restore tokens to parent room if any exists
    const restoreTokens = this.prisma.gameRoom.update({
      where: {
        id: instance.room_id,
      },
      data: {
        tokens: {
          increment: BigInt(dto.tokensToRestore),
        },
      },
    });

    // despose instance
    const desposeInstance = this.prisma.roomInstance.update({
      where: {
        colyseus_room_id: dto.colyseusRoomId,
      },
      data: {
        destroyed_at: new Date(),
        tokens: 0,
      },
    });

    await this.prisma.$transaction([restoreTokens, desposeInstance]);

    return {
      status: 'success',
    };
  }
}
