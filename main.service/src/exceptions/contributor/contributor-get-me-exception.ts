import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ContributorGetMeException implements ErrorCodeType {
  static readonly CONTRIBUTOR_GET_ME_NotFound = new ContributorGetMeException(
    'CONTRIBUTOR_GET_ME_NotFound',
    'Contributor account not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
