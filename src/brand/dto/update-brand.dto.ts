import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBrandDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the brand' })
  name: string;
}
