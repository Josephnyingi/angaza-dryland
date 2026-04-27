import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MapService } from './map.service';
import { CollectionPointType } from './entities/collection-point.entity';
import { IsEnum, IsOptional } from 'class-validator';

class MapPointsQueryDto {
  @IsOptional()
  @IsEnum(CollectionPointType)
  type?: CollectionPointType;
}

@ApiTags('map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('points')
  @ApiOperation({ summary: 'Get all active collection points, warehouses, and buyer zones' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: CollectionPointType,
    description: 'Filter by point type',
  })
  @ApiResponse({ status: 200, description: 'Returns all active map points' })
  @HttpCode(HttpStatus.OK)
  async getPoints(@Query() query: MapPointsQueryDto) {
    return this.mapService.findAllPoints(query.type);
  }
}
