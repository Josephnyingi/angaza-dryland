import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from './entities/listing.entity';
import { Inquiry } from './entities/inquiry.entity';
import { PriceGuide } from './entities/price-guide.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingsRepository: Repository<Listing>,
    @InjectRepository(Inquiry)
    private readonly inquiriesRepository: Repository<Inquiry>,
    @InjectRepository(PriceGuide)
    private readonly priceGuidesRepository: Repository<PriceGuide>,
  ) {}

  async findAllListings(): Promise<Listing[]> {
    return this.listingsRepository.find({
      where: { status: ListingStatus.ACTIVE },
      relations: ['product', 'seller'],
      order: { createdAt: 'DESC' },
    });
  }

  async createListing(dto: CreateListingDto, user: User): Promise<Listing> {
    if (user.role !== UserRole.HARVESTER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only harvesters can create listings');
    }

    const listing = this.listingsRepository.create({
      ...dto,
      sellerId: user.id,
    });

    return this.listingsRepository.save(listing);
  }

  async createInquiry(dto: CreateInquiryDto, user: User): Promise<Inquiry> {
    const listing = await this.listingsRepository.findOne({
      where: { id: dto.listingId },
    });
    if (!listing) {
      throw new NotFoundException(`Listing with id ${dto.listingId} not found`);
    }

    if (listing.sellerId === user.id) {
      throw new ForbiddenException('You cannot inquire about your own listing');
    }

    const inquiry = this.inquiriesRepository.create({
      ...dto,
      buyerId: user.id,
    });

    return this.inquiriesRepository.save(inquiry);
  }

  async getPriceGuides(): Promise<PriceGuide[]> {
    return this.priceGuidesRepository.find({
      relations: ['product'],
      order: { updatedAt: 'DESC' },
    });
  }
}
