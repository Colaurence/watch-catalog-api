import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, Product, Brand, Listing, Currency } from '@prisma/client';
import {
  PaginateFn,
  PaginatedResult,
  PaginateOptions,
  paginate,
} from '../common/utils/paginator';
import { productTransform } from './transformer/product.transformer';
import { GlobalExceptionHandler } from '../exceptions/global-exception.handler';
import { TransformedProduct } from './types/product.type';
import { CurrencyGateway } from '../gateway/currency-conversion/currency.gateway';
import { PRODUCT_ERROR_MESSAGES } from './product.constants';

@Injectable()
export class ProductService {
  private readonly paginate: PaginateFn = paginate({ perPage: 5 });

  constructor(
    private readonly prisma: PrismaService,
    private readonly currencyGateway: CurrencyGateway,
  ) {}

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateRefNo(): string {
    const prefix = this.generateRandomString(10);
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    return `${prefix}-${randomPart}`;
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<TransformedProduct> {
    try {
      const refNo = this.generateRefNo();
      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          brandId: createProductDto.brandId,
          description: createProductDto.description,
          refNo,
          thumbnailUrl: createProductDto.thumbnailUrl,
        },
        include: {
          brand: true,
          listings: true,
        },
      });
      return productTransform(product);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        PRODUCT_ERROR_MESSAGES.CREATE,
      );
    }
  }

  async findAll(
    options?: PaginateOptions,
    searchQuery?: string,
    brandId?: string,
    currency?: Currency,
  ): Promise<PaginatedResult<TransformedProduct>> {
    try {
      const whereClause = this.buildWhereClause(searchQuery, brandId);

      const products = await this.paginate(
        this.prisma.product,
        { where: whereClause, include: { brand: true, listings: true } },
        options,
      );

      const exchangeRates = {};

      const transformedProducts = await Promise.all(
        products.data.map(async (product) => {
          const transformedProduct = productTransform(
            product as Product & { brand: Brand; listings: Listing[] },
          );
          if (currency) {
            for (const listing of transformedProduct.listings) {
              if (listing.currency !== currency) {
                const currencyPair = `${listing.currency}-${currency}`;
                if (!exchangeRates[currencyPair]) {
                  exchangeRates[currencyPair] =
                    await this.currencyGateway.getExchangeRate(
                      listing.currency,
                      currency,
                    );
                }
                const exchangeRate = exchangeRates[currencyPair];
                listing.currency = currency;
                listing.price = listing.price * exchangeRate;
              }
            }
          }
          return transformedProduct;
        }),
      );

      return {
        data: transformedProducts,
        meta: products.meta,
      };
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        PRODUCT_ERROR_MESSAGES.FIND_ALL,
      );
    }
  }

  async findOne(id: string, currency?: Currency): Promise<TransformedProduct> {
    try {
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id },
        include: {
          brand: true,
          listings: true,
        },
      });

      const transformedProduct = productTransform(
        product as Product & { brand: Brand; listings: Listing[] },
      );
      if (currency) {
        for (const listing of transformedProduct.listings) {
          if (listing.currency !== currency) {
            const exchangeRate = await this.currencyGateway.getExchangeRate(
              listing.currency,
              currency,
            );
            listing.currency = currency;
            listing.price = listing.price * exchangeRate;
          }
        }
      }

      return transformedProduct;
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        PRODUCT_ERROR_MESSAGES.FIND_ONE,
      );
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<TransformedProduct> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          brand: true,
          listings: true,
        },
      });
      return productTransform(
        product as Product & { brand: Brand; listings: Listing[] },
      );
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        PRODUCT_ERROR_MESSAGES.UPDATE,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return;
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        PRODUCT_ERROR_MESSAGES.REMOVE,
      );
    }
  }

  private buildWhereClause(
    searchQuery?: string,
    brandId?: string,
  ): Prisma.ProductWhereInput {
    const whereClause: Prisma.ProductWhereInput = {};

    if (searchQuery) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { refNo: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    if (brandId) {
      whereClause.brandId = brandId;
    }

    return whereClause;
  }
}
