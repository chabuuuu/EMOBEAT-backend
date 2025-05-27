import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ContributorExchangePremiumException implements ErrorCodeType {
  static readonly CONTRIBUTOR_EXCHANGE_PREMIUM_NotFound = new ContributorExchangePremiumException(
    'CONTRIBUTOR_EXCHANGE_PREMIUM_NotFound',
    'Contributor account not exists',
    StatusCodes.NOT_FOUND
  );

  static readonly CONTRIBUTOR_EXCHANGE_PREMIUM_NotEnoughPoints = new ContributorExchangePremiumException(
    'CONTRIBUTOR_EXCHANGE_PREMIUM_NotEnoughPoints',
    'Not enough points to exchange for premium',
    StatusCodes.BAD_REQUEST
  );
  static readonly CONTRIBUTOR_EXCHANGE_PREMIUM_ListenerNotFound = new ContributorExchangePremiumException(
    'CONTRIBUTOR_EXCHANGE_PREMIUM_ListenerNotFound',
    'Listener account not exists',
    StatusCodes.NOT_FOUND
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
