import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Prisma, Listing, Product, ListingImg, Currency } from '@prisma/client';
import {
  PaginateFn,
  PaginatedResult,
  PaginateOptions,
  paginate,
} from '../common/utils/paginator';
import { listingTransform } from './transformer/listing.transformer';
import { GlobalExceptionHandler } from '../exceptions/global-exception.handler';
import { TransformedListing } from './types/listing.interface';
import { CurrencyGateway } from '../gateway/currency-conversion/currency.gateway';
import { LISTING_ERROR_MESSAGES } from './listing.constants';

@Injectable()
export class ListingService {
  private readonly paginate: PaginateFn = paginate({ perPage: 5 });

  constructor(
    private readonly prisma: PrismaService,
    private readonly currencyGateway: CurrencyGateway,
  ) {}

  async create(
    createListingDto: CreateListingDto,
  ): Promise<TransformedListing> {
    try {
      const { images, ...listingData } = createListingDto;

      const listing = await this.prisma.listing.create({
        data: {
          ...listingData,
          images: {
            create: images?.map((image) => ({ url: image.url })) || [],
          },
        },
        include: {
          product: true,
          images: true,
        },
      });
      return listingTransform(listing);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        LISTING_ERROR_MESSAGES.CREATE,
      );
    }
  }

  async findAll(
    options?: PaginateOptions,
    searchQuery?: string,
    productId?: string,
    currency?: Currency,
  ): Promise<PaginatedResult<TransformedListing>> {
    try {
      const whereClause = this.buildWhereClause(searchQuery, productId);

      const listings = await this.paginate(
        this.prisma.listing,
        { where: whereClause, include: { product: true, images: true } },
        options,
      );

      const exchangeRates = {};

      const transformedListings = await Promise.all(
        listings.data.map(
          async (
            listing: Listing & { product: Product; images: ListingImg[] },
          ) => {
            const transformedListing = listingTransform(listing);
            if (currency && currency !== listing.currency) {
              const currencyPair = `${listing.currency}-${currency}`;
              if (!exchangeRates[currencyPair]) {
                exchangeRates[currencyPair] =
                  await this.currencyGateway.getExchangeRate(
                    listing.currency,
                    currency,
                  );
              }
              const exchangeRate = exchangeRates[currencyPair];
              transformedListing.currency = currency;
              transformedListing.price = listing.price * exchangeRate;
            }
            return transformedListing;
          },
        ),
      );

      return {
        data: transformedListings,
        meta: listings.meta,
      };
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        LISTING_ERROR_MESSAGES.FIND_ALL,
      );
    }
  }

  async findOne(id: string, currency?: Currency): Promise<TransformedListing> {
    try {
      const listing = await this.prisma.listing.findUniqueOrThrow({
        where: { id },
        include: {
          product: true,
          images: true,
        },
      });

      const transformedListing = listingTransform(listing);

      if (currency && currency !== listing.currency) {
        const exchangeRates = {};
        const currencyPair = `${listing.currency}-${currency}`;
        if (!exchangeRates[currencyPair]) {
          exchangeRates[currencyPair] =
            await this.currencyGateway.getExchangeRate(
              listing.currency,
              currency,
            );
        }
        const exchangeRate = exchangeRates[currencyPair];
        transformedListing.currency = currency;
        transformedListing.price = listing.price * exchangeRate;
      }

      return transformedListing;
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        LISTING_ERROR_MESSAGES.FIND_ONE,
      );
    }
  }

  async update(
    id: string,
    updateListingDto: UpdateListingDto,
  ): Promise<TransformedListing> {
    try {
      const { images, ...updateData } = updateListingDto;

      const listingUpdateData: Prisma.ListingUpdateInput = { ...updateData };

      if (images) {
        await this.prisma.listingImg.deleteMany({
          where: {
            listingId: id,
          },
        });
        listingUpdateData.images = {
          createMany: {
            data: images.map((image) => ({ url: image.url })),
          },
        };
      }

      const listing = await this.prisma.listing.update({
        where: { id },
        data: listingUpdateData,
        include: {
          product: true,
          images: true,
        },
      });
      return listingTransform(listing);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        LISTING_ERROR_MESSAGES.UPDATE,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.listingImg.deleteMany({
        where: { listingId: id },
      });
      await this.prisma.listing.delete({
        where: { id },
      });
      return;
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        LISTING_ERROR_MESSAGES.REMOVE,
      );
    }
  }

  private buildWhereClause(
    searchQuery?: string,
    productId?: string,
  ): Prisma.ListingWhereInput {
    const whereClause: Prisma.ListingWhereInput = {};

    if (searchQuery) {
      whereClause.product = {
        name: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      };
    }

    if (productId) {
      whereClause.productId = productId;
    }

    return whereClause;
  }
}
