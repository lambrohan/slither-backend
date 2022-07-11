import { ApiProperty } from '@nestjs/swagger';
import { FoodType } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateFoodDto {
  @IsEnum(FoodType)
  @ApiProperty()
  type: FoodType;

  @IsNumber()
  @ApiProperty()
  value: number;
}
