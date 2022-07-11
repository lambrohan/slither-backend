import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/admin.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { MetadataService } from './metadata.service';

@Controller('metadata')
@ApiTags('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Public()
  @Get('/food')
  async getFood() {
    return await this.metadataService.getAllFood();
  }

  @Post('/food')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Post('food')
  async addFood(@Body() dto: CreateFoodDto) {
    return await this.metadataService.addFood(dto.type, dto.value);
  }

  @Put('/food/:id')
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  async updateFoodVal(@Param('id') id: string, @Body() dto: UpdateFoodDto) {
    return await this.metadataService.updateFoodValue(id, dto.value);
  }
}
