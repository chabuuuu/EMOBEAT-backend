import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ArtistUpdateException implements ErrorCodeType {
  static readonly ARTIST_UPDATE_NotFound = new ArtistUpdateException(
    'ARTIST_UPDATE_NotFound',
    'Artist not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
