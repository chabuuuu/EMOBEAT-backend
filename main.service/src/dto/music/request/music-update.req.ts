import { IsOptional, MaxLength } from 'class-validator';

export class MusicUpdateReq {
  @IsOptional()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  lyric!: string;

  @IsOptional()
  coverPhoto!: string;

  @IsOptional()
  resourceLink!: string;

  @IsOptional()
  albumIds!: number[];

  @IsOptional()
  genreIds!: number[];

  @IsOptional()
  instrumentIds!: number[];

  @IsOptional()
  periodIds!: number[];

  @IsOptional()
  categoryIds!: number[];

  @IsOptional()
  artistIds!: number[];

  @IsOptional()
  composerIds!: number[];
}
