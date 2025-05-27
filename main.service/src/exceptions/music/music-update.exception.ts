import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class MusicUpdateException implements ErrorCodeType {
  static readonly MUSIC_UPDATE_NotFound = new MusicUpdateException(
    'MUSIC_UPDATE_NotFound',
    'Music not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
