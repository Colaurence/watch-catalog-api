import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Currency, ListingCondition, ListingLocation } from '@prisma/client';

export class UpdateListingImageDto {
  @ApiProperty({
    description: 'ID of the image',
    example: 'img_12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'URL of the image',
    example: 'http://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string;
}

export class UpdateListingDto {
  @ApiProperty({
    enum: Currency,
    description: 'Currency',
    example: 'USD',
    required: false,
  })
  @IsOptional()
  @IsEnum(Currency, {
    message: 'Currency must be a valid enum value (USD, HKD)',
  })
  currency?: Currency;

  @ApiProperty({
    description: 'Price of the listing',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'Year of the listing',
    example: '2023',
    required: false,
  })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiProperty({ description: 'Box included', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  box?: boolean;

  @ApiProperty({
    description: 'Papers included',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  papers?: boolean;

  @ApiProperty({
    enum: ListingLocation,
    description: 'Location of the listing',
    example: 'IN_BOUTIQUE',
    required: false,
  })
  @IsOptional()
  @IsEnum(ListingLocation, {
    message: 'Location must be a valid enum value (IN_BOUTIQUE, ONLINE)',
  })
  location?: ListingLocation;

  @ApiProperty({
    enum: ListingCondition,
    description: 'Condition of the listing',
    example: 'UNWORN',
    required: false,
  })
  @IsOptional()
  @IsEnum(ListingCondition, {
    message:
      'Condition must be a valid enum value (UNWORN, EXCELLENT, VERY_GOOD, FAIR)',
  })
  condition?: ListingCondition;

  @ApiProperty({
    type: [UpdateListingImageDto],
    required: false,
    description: 'List of images',
  })
  @IsOptional()
  images?: UpdateListingImageDto[];
}
