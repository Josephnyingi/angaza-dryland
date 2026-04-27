import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { Listing } from './entities/listing.entity';
import { Inquiry } from './entities/inquiry.entity';
import { PriceGuide } from './entities/price-guide.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Inquiry, PriceGuide])],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
