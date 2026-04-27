import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('price_guides')
export class PriceGuide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    name: 'local_price_kg',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  localPriceKg: number;

  @Column({
    name: 'export_price_kg',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  exportPriceKg: number;

  @Column({ length: 10, default: 'KES' })
  currency: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', length: 255, nullable: true })
  updatedBy: string;
}
