import { Injectable } from '@nestjs/common';
import { FoodType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MetadataService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFood() {
    return await this.prisma.food.findMany();
  }

  async updateFoodValue(id: string, val: number) {
    return await this.prisma.food.update({
      where: {
        id,
      },
      data: {
        value: val,
      },
    });
  }

  async addFood(type: FoodType, value: number) {
    return await this.prisma.food.create({
      data: {
        type,
        value,
      },
    });
  }
}
