import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ContributorUpdateByIdException implements ErrorCodeType {
  static readonly CONTRIBUTOR_UPDATE_NotFound = new ContributorUpdateByIdException(
    'CONTRIBUTOR_UPDATE_NotFound',
    'Contributor not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
