import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ListenerActiveEmailException implements ErrorCodeType {
  static readonly LISTENER_ACTIVE_EMAIL_NotExistsEmail = new ListenerActiveEmailException(
    'LISTENER_ACTIVE_EMAIL_NotExistsEmail',
    'Email not exists',
    StatusCodes.NOT_FOUND
  );

  static readonly LISTENER_ACTIVE_EMAIL_OtpExpired = new ListenerActiveEmailException(
    'LISTENER_ACTIVE_EMAIL_OtpExpired',
    'OTP is expired, please request a new one',
    StatusCodes.BAD_REQUEST
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
