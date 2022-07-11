import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoomInstanceDto {
  @ApiProperty()
  @IsString()
  gameRoomId: string;

  @ApiProperty()
  @IsString()
  colyseusRoomId: string;
}
