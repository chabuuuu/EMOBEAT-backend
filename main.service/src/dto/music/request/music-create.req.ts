import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class MusicCreateReq {
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  lyric!: string;

  @IsOptional()
  mediaId?: string;

  @IsOptional()
  coverPhoto!: string;

  @IsNotEmpty()
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
