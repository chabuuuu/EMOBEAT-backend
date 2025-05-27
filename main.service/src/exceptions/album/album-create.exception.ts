import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class AlbumCreateException implements ErrorCodeType {
  static readonly ALBUM_CREATE_AdminNotFound = new AlbumCreateException(
    'ALBUM_CREATE_AdminNotFound',
    'Admin account not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
