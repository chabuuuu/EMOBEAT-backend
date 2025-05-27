import { QuizCreateInMusicCreateReq } from '@/dto/quiz/request/quiz-create-in-music-create.req';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength, ValidateNested } from 'class-validator';

export class MusicCreateReq {
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  description!: string;

  @IsOptional()
  lyric!: string;

  @IsOptional()
  coverPhoto!: string;

  @IsNotEmpty()
  resourceLink!: string;

  @IsOptional()
  albumIds!: number[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuizCreateInMusicCreateReq)
  quizzes!: QuizCreateInMusicCreateReq[];

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
