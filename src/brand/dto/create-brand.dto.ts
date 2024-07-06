import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the brand' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The category ID of the brand' })
  categoryId: string;
}
