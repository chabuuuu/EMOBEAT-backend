import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ListenerRegisterException implements ErrorCodeType {
  static readonly LISTENER_REGISTER_EmailExists = new ListenerRegisterException(
    'LISTENER_REGISTER_EmailExists',
    'Email already exists',
    StatusCodes.BAD_REQUEST
  );

  static LISTENER_REGISTER_UsernameExists = new ListenerRegisterException(
    'LISTENER_REGISTER_UsernameExists',
    'Username already exists',
    StatusCodes.BAD_REQUEST
  );
  static LISTENER_REGISTER_TooManyRequest = new ListenerRegisterException(
    'LISTENER_REGISTER_TooManyRequest',
    'The email has been sent, please check your inbox',
    StatusCodes.BAD_REQUEST
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
