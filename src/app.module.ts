import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { ListingModule } from './listing/listing.module';
import { PrismaModule } from './prisma/prisma.module';
import { CurrencyGateway } from './gateway/currency-conversion/currency.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    ListingModule,
    PrismaModule,
  ],
  providers: [CurrencyGateway],
})
export class AppModule {}
