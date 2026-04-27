import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

export enum ListingQuality {
  GRADE_A = 'grade-a',
  GRADE_B = 'grade-b',
  GRADE_C = 'grade-c',
}

export enum ListingStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  PENDING = 'pending',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @ManyToOne(() => Product, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    name: 'quantity_kg',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  quantityKg: number;

  @Column({
    name: 'price_per_kg',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  pricePerKg: number;

  @Column({
    type: 'enum',
    enum: ListingQuality,
    default: ListingQuality.GRADE_B,
  })
  quality: ListingQuality;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.ACTIVE,
  })
  status: ListingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
