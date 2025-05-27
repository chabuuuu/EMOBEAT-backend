import { IsNotEmpty, IsOptional } from 'class-validator';

export class CategoryCreateReq {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  picture!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  musicIds?: number[];
}
