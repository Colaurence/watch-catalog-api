import { ApiProperty } from '@nestjs/swagger';

export class TransformedListingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  year: string;

  @ApiProperty()
  box: boolean;

  @ApiProperty()
  papers: boolean;

  @ApiProperty()
  location: string;

  @ApiProperty()
  condition: string;

  @ApiProperty({ type: [String] })
  images: string[];
}
