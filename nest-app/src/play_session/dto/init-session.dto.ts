import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class InitSessionDto {
  @ApiProperty()
  @IsString()
  publicAddress: string;

  @ApiProperty()
  @IsString()
  roomName: string;

  @ApiProperty()
  @IsNumber()
  stakeAmtUsd: number;
}
