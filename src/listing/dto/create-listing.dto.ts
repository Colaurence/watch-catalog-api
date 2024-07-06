import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Currency, ListingCondition, ListingLocation } from '@prisma/client';

export class CreateListingImageDto {
  @ApiProperty({
    description: 'URL of the image',
    example: 'http://example.com/image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  url: string;
}

export class CreateListingDto {
  @ApiProperty({ description: 'Product ID', example: 'prod_12345' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ enum: Currency, description: 'Currency', example: 'USD' })
  @IsNotEmpty()
  @IsEnum(Currency, {
    message: 'Currency must be a valid enum value (USD, HKD)',
  })
  currency: Currency;

  @ApiProperty({ description: 'Price of the listing', example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Year of the listing', example: '2023' })
  @IsNotEmpty()
  @IsString()
  year: string;

  @ApiProperty({ description: 'Box included', example: true })
  @IsNotEmpty()
  @IsBoolean()
  box: boolean;

  @ApiProperty({ description: 'Papers included', example: true })
  @IsNotEmpty()
  @IsBoolean()
  papers: boolean;

  @ApiProperty({
    enum: ListingLocation,
    description: 'Location of the listing',
    example: 'IN_BOUTIQUE',
  })
  @IsNotEmpty()
  @IsEnum(ListingLocation, {
    message: 'Location must be a valid enum value (IN_BOUTIQUE, ONLINE)',
  })
  location: ListingLocation;

  @ApiProperty({
    enum: ListingCondition,
    description: 'Condition of the listing',
    example: 'UNWORN',
  })
  @IsNotEmpty()
  @IsEnum(ListingCondition, {
    message:
      'Condition must be a valid enum value (UNWORN, EXCELLENT, VERY_GOOD, FAIR)',
  })
  condition: ListingCondition;

  @ApiProperty({
    type: [CreateListingImageDto],
    required: false,
    description: 'List of images',
  })
  @IsOptional()
  images?: CreateListingImageDto[];
}
