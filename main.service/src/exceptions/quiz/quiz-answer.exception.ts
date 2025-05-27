import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class QuizAnswerException implements ErrorCodeType {
  static readonly QUIZ_ANSWER_NotFound = new QuizAnswerException(
    'QUIZ_ANSWER_NotFound',
    'Quiz not exists',
    StatusCodes.NOT_FOUND
  );

  static readonly QUIZ_ANSWER_AlreadyExists = new QuizAnswerException(
    'QUIZ_ANSWER_AlreadyExists',
    'You have already answered this quiz',
    StatusCodes.BAD_REQUEST
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
