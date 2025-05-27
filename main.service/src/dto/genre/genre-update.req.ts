import { IsOptional, MaxLength } from 'class-validator';

export class GenreUpdateReq {
  @IsOptional()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  picture!: string;
}
