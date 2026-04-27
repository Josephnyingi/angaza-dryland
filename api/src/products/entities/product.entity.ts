import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum ProductCategory {
  BAOBAB = 'baobab',
  TAMARIND = 'tamarind',
  WILD_COTTON = 'wild-cotton',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'local_name', length: 255, nullable: true })
  localName: string;

  @Column({ name: 'scientific_name', length: 255, nullable: true })
  scientificName: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'nutritional_info', type: 'jsonb', nullable: true })
  nutritionalInfo: Record<string, any>;

  @Column({ name: 'harvesting_calendar', type: 'jsonb', nullable: true })
  harvestingCalendar: Record<string, any>;

  @Column({ name: 'processing_methods', type: 'jsonb', nullable: true })
  processingMethods: Record<string, any>;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
