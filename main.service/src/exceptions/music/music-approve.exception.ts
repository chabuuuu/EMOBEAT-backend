import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class MusicApproveException implements ErrorCodeType {
  static readonly MUSIC_APPROVE_NotFound = new MusicApproveException(
    'MUSIC_APPROVE_NotFound',
    'Music not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
