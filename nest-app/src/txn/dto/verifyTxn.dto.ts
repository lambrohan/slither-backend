import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyTxnDto {
  @ApiProperty()
  @IsString()
  hash: string;
}
