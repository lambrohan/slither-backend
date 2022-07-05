import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class EndSessionDto {
  @ApiProperty()
  @IsString()
  sessionId: string;

  @IsNumber()
  @ApiProperty()
  kills: number;

  @IsNumber()
  @ApiProperty()
  tokensEarned: number;

  @IsBoolean()
  @ApiProperty()
  won: boolean;

  @IsDateString()
  @ApiProperty()
  finishedAt: string;
}
