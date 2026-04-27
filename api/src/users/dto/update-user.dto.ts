import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserLanguage, UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Mwangi' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName?: string;

  @ApiPropertyOptional({ example: '+254712345678' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;

  @ApiPropertyOptional({ example: 'Makueni' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  county?: string;

  @ApiPropertyOptional({ enum: UserLanguage, example: UserLanguage.SW })
  @IsOptional()
  @IsEnum(UserLanguage)
  language?: UserLanguage;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.HARVESTER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
