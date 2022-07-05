import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class AddEarningDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  tokens: number;
}
