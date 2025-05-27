import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class MusicRejectException implements ErrorCodeType {
  static readonly MUSIC_REJECT_NotFound = new MusicRejectException(
    'MUSIC_REJECT_NotFound',
    'Music not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
