import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  public_address: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
