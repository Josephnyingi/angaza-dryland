import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Baobab' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiPropertyOptional({ example: 'Mbuyu' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  localName?: string;

  @ApiPropertyOptional({ example: 'Adansonia digitata' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  scientificName?: string;

  @ApiProperty({ enum: ProductCategory, example: ProductCategory.BAOBAB })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiPropertyOptional({ example: 'Rich in vitamin C and antioxidants...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: { vitaminC: '300mg per 100g', calcium: '295mg per 100g' },
  })
  @IsOptional()
  @IsObject()
  nutritionalInfo?: Record<string, any>;

  @ApiPropertyOptional({
    example: { season: 'April - June', peak: 'May' },
  })
  @IsOptional()
  @IsObject()
  harvestingCalendar?: Record<string, any>;

  @ApiPropertyOptional({
    example: { drying: 'Sun-dry pods for 2-3 weeks', milling: 'Remove seeds and mill pulp' },
  })
  @IsOptional()
  @IsObject()
  processingMethods?: Record<string, any>;

  @ApiPropertyOptional({ example: 'https://example.com/images/baobab.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
