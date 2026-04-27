import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingModuleEntity } from './entities/training-module.entity';
import { TrainingCompletion } from './entities/training-completion.entity';
import { CompleteModuleDto } from './dto/complete-module.dto';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(TrainingModuleEntity)
    private readonly modulesRepository: Repository<TrainingModuleEntity>,
    @InjectRepository(TrainingCompletion)
    private readonly completionsRepository: Repository<TrainingCompletion>,
  ) {}

  async findAll(): Promise<TrainingModuleEntity[]> {
    return this.modulesRepository.find({
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TrainingModuleEntity> {
    const module = await this.modulesRepository.findOne({ where: { id } });
    if (!module) {
      throw new NotFoundException(`Training module with id ${id} not found`);
    }
    return module;
  }

  async complete(
    moduleId: string,
    userId: string,
    dto: CompleteModuleDto,
  ): Promise<TrainingCompletion> {
    // Verify the module exists
    await this.findOne(moduleId);

    // Check if already completed by this user
    const existing = await this.completionsRepository.findOne({
      where: { moduleId, userId },
    });

    if (existing) {
      // Update score if provided
      if (dto.score !== undefined) {
        existing.score = dto.score;
        return this.completionsRepository.save(existing);
      }
      return existing;
    }

    const completion = this.completionsRepository.create({
      moduleId,
      userId,
      score: dto.score,
    });

    return this.completionsRepository.save(completion);
  }

  async getUserCompletions(userId: string): Promise<TrainingCompletion[]> {
    return this.completionsRepository.find({
      where: { userId },
      relations: ['module'],
      order: { completedAt: 'DESC' },
    });
  }
}
