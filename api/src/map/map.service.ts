import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionPoint, CollectionPointType } from './entities/collection-point.entity';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(CollectionPoint)
    private readonly pointsRepository: Repository<CollectionPoint>,
  ) {}

  async findAllPoints(type?: CollectionPointType): Promise<CollectionPoint[]> {
    const where: Partial<CollectionPoint> = { isActive: true };
    if (type) {
      where.type = type;
    }
    return this.pointsRepository.find({
      where,
      order: { county: 'ASC', name: 'ASC' },
    });
  }
}
