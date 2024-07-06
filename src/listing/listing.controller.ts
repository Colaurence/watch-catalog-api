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
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PaginateOptions } from '../common/utils/paginator';
import { ListingQueryDto } from './dto/listing-query.dto';
import { TransformedListing } from './types/listing.interface';
import { PaginatedResult } from '../common/utils/paginator';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { TransformedListingDto } from './dto/transformed-listing.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Listing')
@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new listing' })
  @ApiBody({ type: CreateListingDto })
  @ApiResponse({
    status: 201,
    description: 'Listing created successfully',
    type: TransformedListingDto,
  })
  create(
    @Body() createListingDto: CreateListingDto,
  ): Promise<TransformedListing> {
    return this.listingService.create(createListingDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Get a list of listings' })
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
    description: 'List of listings',
    type: PaginatedResultDto,
  })
  findAll(
    @Query() query: ListingQueryDto,
  ): Promise<PaginatedResult<TransformedListing>> {
    const options: PaginateOptions = {
      page: query.page,
      perPage: query.perPage,
    };
    return this.listingService.findAll(
      options,
      query.search,
      query.productId,
      query.currency,
    );
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Get a listing by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the listing to retrieve',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    enum: ['USD', 'HKD'],
  })
  @ApiResponse({
    status: 200,
    description: 'The listing',
    type: TransformedListingDto,
  })
  findOne(
    @Param('id') id: string,
    @Query() query: ListingQueryDto,
  ): Promise<TransformedListing> {
    return this.listingService.findOne(id, query.currency);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a listing by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the listing to update',
  })
  @ApiBody({ type: UpdateListingDto })
  @ApiResponse({
    status: 200,
    description: 'Listing updated successfully',
    type: TransformedListingDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
  ): Promise<TransformedListing> {
    return this.listingService.update(id, updateListingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a listing by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the listing to delete',
  })
  @ApiResponse({ status: 204, description: 'Listing deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.listingService.remove(id);
  }
}
