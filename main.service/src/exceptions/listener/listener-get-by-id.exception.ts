import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ListenerGetByIdException implements ErrorCodeType {
  static readonly LISTENER_GET_BY_ID_NotFound = new ListenerGetByIdException(
    'LISTENER_GET_BY_ID_NotFound',
    'Listener account not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
