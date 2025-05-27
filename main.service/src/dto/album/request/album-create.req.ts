import { IsNotEmpty, IsOptional } from 'class-validator';

export class AlbumCreateReq {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  coverPhoto!: string | null;

  @IsNotEmpty()
  releaseDate!: Date;

  @IsNotEmpty()
  albumType!: string;

  @IsOptional()
  description!: string | null;

  @IsOptional()
  genreIds?: number[];

  @IsOptional()
  musicIds?: number[];
}
