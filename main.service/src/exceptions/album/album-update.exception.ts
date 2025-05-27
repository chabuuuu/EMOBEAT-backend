import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class AlbumUpdateException implements ErrorCodeType {
  static readonly ALBUM_UPDATE_AdminNotFound = new AlbumUpdateException(
    'ALBUM_UPDATE_AdminNotFound',
    'Admin account not exists',
    StatusCodes.NOT_FOUND
  );

  static readonly ALBUM_UPDATE_AlbumNotFound = new AlbumUpdateException(
    'ALBUM_UPDATE_AlbumNotFound',
    'Album not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
