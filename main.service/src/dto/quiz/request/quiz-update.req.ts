import { IsOptional, MaxLength, IsEnum } from 'class-validator';

export class QuizUpdateReq {
  @IsOptional()
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

  @IsOptional()
  @IsEnum(['A', 'B', 'C', 'D'])
  correctAnswer!: string;
}
