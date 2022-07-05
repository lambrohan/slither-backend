import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @Min(0)
  min_usd_to_join: number;

  @IsNumber()
  max_usd_to_join: number;
}
