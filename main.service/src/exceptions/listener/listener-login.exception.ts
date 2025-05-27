import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ListenerLoginException implements ErrorCodeType {
  static readonly LISTENER_LOGIN_NotFound = new ListenerLoginException(
    'LISTENER_LOGIN_NotFound',
    'Listener account not exists',
    StatusCodes.NOT_FOUND
  );

  static readonly LISTENER_LOGIN_WrongPasswordOrUsername = new ListenerLoginException(
    'LISTENER_LOGIN_WrongPasswordOrUsername',
    'Wrong password or username',
    StatusCodes.UNAUTHORIZED
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
