import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class QuizCreateInMusicCreateReq {
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @MaxLength(50)
  answerA!: string;

  @IsOptional()
  @MaxLength(50)
  answerB!: string;

  @IsOptional()
  @MaxLength(50)
  answerC!: string;

  @IsOptional()
  @MaxLength(50)
  answerD!: string;

  @IsNotEmpty()
  @IsEnum(['A', 'B', 'C', 'D'])
  correctAnswer!: string;
}
