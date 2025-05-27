import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ListenerUpdateByIdException implements ErrorCodeType {
  static readonly LISTENER_UPDATE_BY_ID_NotFound = new ListenerUpdateByIdException(
    'LISTENER_UPDATE_BY_ID_NotFound',
    'Listener account not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
