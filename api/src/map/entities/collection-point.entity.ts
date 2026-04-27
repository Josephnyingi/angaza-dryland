import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum CollectionPointType {
  COLLECTION_POINT = 'collection-point',
  WAREHOUSE = 'warehouse',
  BUYER_ZONE = 'buyer-zone',
}

@Entity('collection_points')
export class CollectionPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: CollectionPointType,
    default: CollectionPointType.COLLECTION_POINT,
  })
  type: CollectionPointType;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lng: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  county: string;

  @Column({ name: 'contact_name', length: 255, nullable: true })
  contactName: string;

  @Column({ name: 'contact_phone', length: 20, nullable: true })
  contactPhone: string;

  @Column({ name: 'operating_hours', length: 255, nullable: true })
  operatingHours: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
