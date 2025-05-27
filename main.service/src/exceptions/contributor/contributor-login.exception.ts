import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ContributorLoginException implements ErrorCodeType {
  static readonly CONTRIBUTOR_LOGIN_NotFound = new ContributorLoginException(
    'CONTRIBUTOR_LOGIN_NotFound',
    'Contributor account not exists',
    StatusCodes.NOT_FOUND
  );

  static readonly CONTRIBUTOR_LOGIN_WrongPasswordOrUsername = new ContributorLoginException(
    'CONTRIBUTOR_LOGIN_WrongPasswordOrUsername',
    'Wrong password or username',
    StatusCodes.UNAUTHORIZED
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
