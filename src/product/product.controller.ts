import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListingQueryDto } from '../listing/dto/listing-query.dto';
import { PaginateOptions } from '../common/utils/paginator';
import { TransformedProduct } from './types/product.type';
import { PaginatedResult } from '../common/utils/paginator';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { TransformedProductDto } from './dto/transformed-product.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: TransformedProductDto,
  })
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<TransformedProduct> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Get a list of products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'productId', required: false, type: String })
  @ApiQuery({
    name: 'currency',
    required: false,
    enum: ['USD', 'HKD'],
  })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: PaginatedResultDto,
  })
  findAll(
    @Query() query: ListingQueryDto,
  ): Promise<PaginatedResult<TransformedProduct>> {
    const options: PaginateOptions = {
      page: query.page,
      perPage: query.perPage,
    };
    return this.productService.findAll(
      options,
      query.search,
      query.productId,
      query.currency,
    );
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the product to retrieve',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    enum: ['USD', 'HKD'],
  })
  @ApiResponse({
    status: 200,
    description: 'The product',
    type: TransformedProductDto,
  })
  findOne(
    @Param('id') id: string,
    @Query() query: ListingQueryDto,
  ): Promise<TransformedProduct> {
    return this.productService.findOne(id, query.currency);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the product to update',
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: TransformedProductDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<TransformedProduct> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the product to delete',
  })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
