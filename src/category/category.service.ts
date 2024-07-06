import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
import {
  PaginateFn,
  PaginatedResult,
  PaginateOptions,
  paginate,
} from '../common/utils/paginator';
import { categoryTransform } from './transformer/category.transformer';
import { GlobalExceptionHandler } from '../exceptions/global-exception.handler';
import { TransformedCategory } from './types/category.interface';
import { CATEGORY_ERROR_MESSAGES } from './category.constants';

@Injectable()
export class CategoryService {
  private readonly paginate: PaginateFn = paginate({ perPage: 5 });

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<TransformedCategory> {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });
      return categoryTransform(category);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        CATEGORY_ERROR_MESSAGES.CREATE,
      );
    }
  }

  async findAll(
    options?: PaginateOptions,
    searchQuery?: string,
  ): Promise<PaginatedResult<TransformedCategory>> {
    try {
      const whereClause = this.buildWhereClause(searchQuery);

      const categories = await this.paginate(
        this.prisma.category,
        { where: whereClause },
        options,
      );

      const transformedCategories = categories.data.map(categoryTransform);

      return {
        data: transformedCategories,
        meta: categories.meta,
      };
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        CATEGORY_ERROR_MESSAGES.FIND_ALL,
      );
    }
  }

  async findOne(id: string): Promise<TransformedCategory> {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id },
      });
      return categoryTransform(category);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        CATEGORY_ERROR_MESSAGES.FIND_ONE,
      );
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<TransformedCategory> {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
      return categoryTransform(category);
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        CATEGORY_ERROR_MESSAGES.UPDATE,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
      return;
    } catch (error) {
      GlobalExceptionHandler.handlePrismaError(
        error,
        CATEGORY_ERROR_MESSAGES.REMOVE,
      );
    }
  }

  private buildWhereClause(searchQuery?: string): Prisma.CategoryWhereInput {
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
