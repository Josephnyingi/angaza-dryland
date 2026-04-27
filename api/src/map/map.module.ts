import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { CollectionPoint } from './entities/collection-point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionPoint])],
  controllers: [MapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
