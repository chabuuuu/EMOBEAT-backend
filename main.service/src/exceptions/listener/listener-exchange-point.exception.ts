import { ErrorCodeType } from '@/exceptions/error-code-type';
import { StatusCodes } from 'http-status-codes';

export class ListenerExchangePointException implements ErrorCodeType {
  static readonly LISTENER_EXCHANGE_POINT_NotFound = new ListenerExchangePointException(
    'LISTENER_EXCHANGE_POINT_NotFound',
    'Listener account not exists',
    StatusCodes.NOT_FOUND
  );
  static readonly LISTENER_EXCHANGE_POINT_NotEnoughPoints = new ListenerExchangePointException(
    'LISTENER_EXCHANGE_POINT_NotEnoughPoints',
    'Not enough points to exchange for premium',
    StatusCodes.BAD_REQUEST
  );

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly httpStatus: StatusCodes
  ) {}
}
