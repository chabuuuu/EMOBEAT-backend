import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class MusicGetByIdException implements ErrorCodeType {
  static readonly MUSIC_GET_BY_ID_NotFound = new MusicGetByIdException(
    'MUSIC_GET_BY_ID_NotFound',
    'Music not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
