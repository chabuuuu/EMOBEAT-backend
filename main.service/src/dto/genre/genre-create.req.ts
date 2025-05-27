import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class GenreCreateReq {
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  picture!: string;
}
