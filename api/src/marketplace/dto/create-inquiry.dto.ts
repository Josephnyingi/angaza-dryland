import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty({ example: 'uuid-of-listing' })
  @IsUUID()
  listingId: string;

  @ApiProperty({ example: 'I am interested in buying 20kg of your baobab. Is it still available?' })
  @IsString()
  @MinLength(10)
  message: string;

  @ApiPropertyOptional({ example: 'buyer@example.com' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}
