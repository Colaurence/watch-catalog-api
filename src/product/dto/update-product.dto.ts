import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the product' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'A description of the product' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The URL of the product thumbnail image' })
  thumbnailUrl: string;
}
