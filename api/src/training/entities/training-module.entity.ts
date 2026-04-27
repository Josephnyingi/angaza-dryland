import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { TrainingCompletion } from './training-completion.entity';

@Entity('training_modules')
export class TrainingModuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'title_sw', length: 255, nullable: true })
  titleSw: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'video_url', length: 500, nullable: true })
  videoUrl: string;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @Column({ type: 'text', array: true, default: [] })
  topics: string[];

  @Column({ name: 'badge_quiz', type: 'jsonb', nullable: true })
  badgeQuiz: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => TrainingCompletion, (completion) => completion.module)
  completions: TrainingCompletion[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
