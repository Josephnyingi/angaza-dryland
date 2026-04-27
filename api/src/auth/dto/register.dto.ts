import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserLanguage, UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Jane' })
  @IsString()
  @Length(1, 100)
  firstName: string;

  @ApiProperty({ example: 'Mwangi' })
  @IsString()
  @Length(1, 100)
  lastName: string;

  @ApiPropertyOptional({ example: '+254712345678' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.HARVESTER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: 'Makueni' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  county?: string;

  @ApiPropertyOptional({ enum: UserLanguage, default: UserLanguage.EN })
  @IsOptional()
  @IsEnum(UserLanguage)
  language?: UserLanguage;
}
