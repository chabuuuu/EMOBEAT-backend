import { ErrorCode } from '@/enums/error-code.enums';
import { GeneralException } from '@/exceptions/base/general-exception';
import BaseError from '@/utils/error/base.error';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateRequest(dto: any, data: any): Promise<any> {
  const dtoInstance = plainToInstance(dto, data);
  const validateErrors = await validate(dtoInstance, {
    validationError: { target: false, value: false }
  });
  if (validateErrors.length > 0) {
    const formatError = validateErrors.map((error: any) => Object.values(error.constraints).join(', '));
    throw new BaseError(
      GeneralException.GNR_VALIDATION_ERROR.code,
      GeneralException.GNR_VALIDATION_ERROR.message,
      GeneralException.GNR_VALIDATION_ERROR.httpStatus,
      null,
      formatError
    );
  }
  return dtoInstance;
}
