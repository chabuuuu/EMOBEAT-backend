import { StatusCodes } from 'http-status-codes';

class BaseError extends Error {
  public code: string;
  public msg: string;
  public data?: any;
  public validateError?: string[];
  public httpStatus?: number;

  /**
   * Generate a new instance of BaseException
   * @param code
   * @param msg
   * @param data
   */
  constructor(code: string, msg: string, httpStatus?: number, data?: any, validateError?: string[]) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
    this.msg = msg;
    this.data = data;
    this.httpStatus = httpStatus;
    this.validateError = validateError;
    Error.captureStackTrace(this);
  }
}
export default BaseError;
