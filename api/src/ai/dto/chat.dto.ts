import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class ChatDto {
  @ApiProperty({ example: 'What is the best time to harvest baobab in Makueni County?' })
  @IsString()
  @MinLength(1)
  message: string;

  @ApiPropertyOptional({ enum: ['en', 'sw'], default: 'en' })
  @IsEnum(['en', 'sw'])
  language: 'en' | 'sw' = 'en';
}
