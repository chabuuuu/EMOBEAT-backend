import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class GeneralException implements ErrorCodeType {
  static readonly GNR_NOT_LOGGED_IN = new GeneralException(
    'GNR_NOT_LOGGED_IN',
    'You need to login first',
    StatusCodes.UNAUTHORIZED
  );

  static readonly GNR_VALIDATION_ERROR = new GeneralException(
    'GNR_VALIDATION_ERROR',
    'You need to login first',
    StatusCodes.UNAUTHORIZED
  );

  static readonly GNR_NOT_HAVE_PERMISSION = new GeneralException(
    'GNR_NOT_HAVE_PERMISSION',
    'You do not have permission to access this resource',
    StatusCodes.FORBIDDEN
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
