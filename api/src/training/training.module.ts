import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { TrainingModuleEntity } from './entities/training-module.entity';
import { TrainingCompletion } from './entities/training-completion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingModuleEntity, TrainingCompletion]),
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
