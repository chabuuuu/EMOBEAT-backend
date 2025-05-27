import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class AdminLoginException implements ErrorCodeType {
  static readonly ADMIN_LOGIN_NotFound = new AdminLoginException(
    'ADMIN_LOGIN_NotFound',
    'Admin account not exists',
    StatusCodes.NOT_FOUND
  );

  static readonly ADMIN_LOGIN_WrongPasswordOrUsername = new AdminLoginException(
    'ADMIN_LOGIN_WrongPasswordOrUsername',
    'Wrong password or username',
    StatusCodes.UNAUTHORIZED
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
