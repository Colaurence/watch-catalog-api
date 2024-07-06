import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the category' })
  name: string;
}
