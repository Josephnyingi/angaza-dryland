import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('listings')
  @ApiOperation({ summary: 'List all active marketplace listings' })
  @ApiResponse({ status: 200, description: 'Returns all active listings' })
  @HttpCode(HttpStatus.OK)
  async findAllListings() {
    return this.marketplaceService.findAllListings();
  }

  @Post('listings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HARVESTER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new marketplace listing (harvesters only)' })
  @ApiResponse({ status: 201, description: 'Listing created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — only harvesters can list' })
  @HttpCode(HttpStatus.CREATED)
  async createListing(
    @Body() dto: CreateListingDto,
    @CurrentUser() user: User,
  ) {
    return this.marketplaceService.createListing(dto, user);
  }

  @Post('inquiries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send an inquiry about a listing (buyers only)' })
  @ApiResponse({ status: 201, description: 'Inquiry submitted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — only buyers can inquire' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @HttpCode(HttpStatus.CREATED)
  async createInquiry(
    @Body() dto: CreateInquiryDto,
    @CurrentUser() user: User,
  ) {
    return this.marketplaceService.createInquiry(dto, user);
  }

  @Get('prices')
  @ApiOperation({ summary: 'Get current price guide for all products' })
  @ApiResponse({ status: 200, description: 'Returns current price guides' })
  @HttpCode(HttpStatus.OK)
  async getPriceGuides() {
    return this.marketplaceService.getPriceGuides();
  }
}
