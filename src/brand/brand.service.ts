import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Prisma } from '@prisma/client';
import {
  PaginateFn,
  PaginatedResult,
  PaginateOptions,
  paginate,
} from '../common/utils/paginator';
import { brandTransform } from './transformer/brand.transformer';
import { GlobalExceptionHandler } from '../exceptions/global-exception.handler';
import { TransformedBrand } from './types/brand.interface';

@Injectable()
export class BrandService {
  private readonly paginate: PaginateFn = paginate({ perPage: 5 });

  constructor(private readonly prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto): Promise<TransformedBrand> {
    try {
      const brand = await this.prisma.brand.create({
        data: {
          name: createBrandDto.name,
          categoryId: createBrandDto.categoryId,
        },
        include: {
          category: true,
        },
      });
      return brandTransform(brand);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(error, 'Brand already exists');
    }
  }

  async findAll(
    options?: PaginateOptions,
    searchQuery?: string,
  ): Promise<PaginatedResult<TransformedBrand>> {
    try {
      const whereClause = this.buildWhereClause(searchQuery);

      const brands = await this.paginate(
        this.prisma.brand,
        { where: whereClause, include: { category: true } },
        options,
      );

      const transformedBrands = brands.data.map(brandTransform);

      return {
        data: transformedBrands,
        meta: brands.meta,
      };
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(error);
    }
  }

  async findOne(id: string): Promise<TransformedBrand> {
    try {
      const brand = await this.prisma.brand.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
        },
      });
      return brandTransform(brand);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(error, 'Brand does not exist');
    }
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<TransformedBrand> {
    try {
      const brand = await this.prisma.brand.update({
        where: { id },
        data: updateBrandDto,
        include: {
          category: true,
        },
      });
      return brandTransform(brand);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(error, 'Brand does not exist');
    }
  }

  async remove(id: string): Promise<TransformedBrand> {
    try {
      const brand = await this.prisma.brand.delete({
        where: { id },
        include: {
          category: true,
        },
      });
      return brandTransform(brand);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(error, 'Brand does not exist');
    }
  }

  private buildWhereClause(searchQuery?: string): Prisma.BrandWhereInput {
    if (!searchQuery) {
      return {};
    }

    return {
      name: {
        contains: searchQuery,
        mode: 'insensitive',
      },
    };
  }
}
