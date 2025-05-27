import { IsOptional } from 'class-validator';

export class CategoryUpdateReq {
  @IsOptional()
  name!: string;

  @IsOptional()
  picture!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  musicIds?: number[];
}
