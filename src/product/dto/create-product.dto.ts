import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the product' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The ID of the brand associated with the product',
  })
  brandId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'A description of the product' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The URL of the product thumbnail image' })
  thumbnailUrl: string;
}
