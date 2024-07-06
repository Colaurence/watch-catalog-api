import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Currency } from '@prisma/client';

export class ListingQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  perPage?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsEnum(Currency, {
    message: 'Currency must be a valid enum value (USD, HKD)',
  })
  currency?: Currency;
}
