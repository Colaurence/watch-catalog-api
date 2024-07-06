import { ApiProperty } from '@nestjs/swagger';

export class TransformedProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  brandId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  refNo: string;

  @ApiProperty()
  thumbnailUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
