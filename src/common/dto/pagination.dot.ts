import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginateDTO {
  @ApiProperty({
    default: 10,
    description: 'Numero de elementos',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;
  @ApiProperty({
    default: 0,
    description: 'Paginacion',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
