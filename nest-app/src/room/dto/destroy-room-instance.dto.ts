import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class DestroyRoomInstanceDto {
  @ApiProperty()
  @IsString()
  colyseusRoomId: string;

  @ApiProperty()
  @IsNumberString()
  tokensToRestore: bigint;
}
