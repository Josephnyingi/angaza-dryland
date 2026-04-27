import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrainingModuleEntity } from './training-module.entity';

@Entity('training_completions')
export class TrainingCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'module_id' })
  moduleId: string;

  @ManyToOne(() => TrainingModuleEntity, (module) => module.completions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: TrainingModuleEntity;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;

  @Column({ type: 'int', nullable: true })
  score: number;
}
