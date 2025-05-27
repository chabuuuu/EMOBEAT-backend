import { IsNotEmpty, IsEnum } from 'class-validator';

export class QuizAnswerReq {
  @IsNotEmpty()
  @IsEnum(['A', 'B', 'C', 'D'])
  answer!: string;
}
