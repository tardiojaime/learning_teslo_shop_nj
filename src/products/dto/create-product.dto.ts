import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;
  // cada elemento deve de ser string
  @IsString({ each: true })
  @IsArray()
  sizes: string[];
  // que vengan en los siguiente valores
  @IsIn(['man', 'women', 'kid', 'unisex'])
  gender: string;
  //tags
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
  //images
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
