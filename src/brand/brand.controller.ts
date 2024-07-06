import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginateOptions } from '../common/utils/paginator';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { TransformedBrandDto } from './dto/transformed-brand.dto';

@ApiTags('Brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({
    status: 201,
    description: 'Brand created successfully',
    type: TransformedBrandDto,
  })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of brands' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of brands',
    type: PaginatedResultDto,
  })
  findAll(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('search') searchQuery?: string,
  ) {
    const options: PaginateOptions = { page, perPage };
    return this.brandService.findAll(options, searchQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the brand to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The brand',
    type: TransformedBrandDto,
  })
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a brand by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the brand to update',
  })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({
    status: 200,
    description: 'Brand updated successfully',
    type: TransformedBrandDto,
  })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the brand to delete',
  })
  @ApiResponse({ status: 204, description: 'Brand deleted successfully' })
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
