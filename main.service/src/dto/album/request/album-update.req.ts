import { IsOptional } from 'class-validator';

export class AlbumUpdateReq {
  @IsOptional()
  name!: string | null;

  @IsOptional()
  coverPhoto!: string | null;

  @IsOptional()
  releaseDate!: Date | null;

  @IsOptional()
  albumType!: string | null;

  @IsOptional()
  description!: string | null;

  @IsOptional()
  genreIds?: number[];

  @IsOptional()
  musicIds?: number[];
}
