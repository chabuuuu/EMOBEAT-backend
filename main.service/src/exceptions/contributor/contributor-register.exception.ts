import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ContributorRegisterException implements ErrorCodeType {
  static readonly CONTRIBUTOR_REGISTER_EmailExists = new ContributorRegisterException(
    'CONTRIBUTOR_REGISTER_EmailExists',
    'Email already exists',
    StatusCodes.BAD_REQUEST
  );

  static CONTRIBUTOR_REGISTER_UsernameExists = new ContributorRegisterException(
    'CONTRIBUTOR_REGISTER_UsernameExists',
    'Username already exists',
    StatusCodes.BAD_REQUEST
  );
  static CONTRIBUTOR_REGISTER_TooManyRequest = new ContributorRegisterException(
    'CONTRIBUTOR_REGISTER_TooManyRequest',
    'The email has been sent, please check your inbox',
    StatusCodes.BAD_REQUEST
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
