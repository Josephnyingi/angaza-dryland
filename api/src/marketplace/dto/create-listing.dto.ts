import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ListingQuality } from '../entities/listing.entity';

export class CreateListingDto {
  @ApiProperty({ example: 'uuid-of-product' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 50.5, description: 'Quantity available in kilograms' })
  @IsNumber()
  @IsPositive()
  quantityKg: number;

  @ApiProperty({ example: 150, description: 'Price per kilogram in KES' })
  @IsNumber()
  @IsPositive()
  pricePerKg: number;

  @ApiPropertyOptional({ enum: ListingQuality, default: ListingQuality.GRADE_B })
  @IsOptional()
  @IsEnum(ListingQuality)
  quality?: ListingQuality;

  @ApiPropertyOptional({ example: 'Sun-dried baobab pulp, no additives' })
  @IsOptional()
  @IsString()
  description?: string;
}
