import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import BaseError from '@/utils/error/base.error';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export class SecurityRoleUtil {
  static async checkRole(req: Request, roleCode: string): Promise<void> {
    const user = await getCurrentLoggedUser(req);

    if (!user || !user.role) {
      throw new BaseError('UNAUTHORIZED', 'You are not authorized to access this resource.', StatusCodes.UNAUTHORIZED);
    }

    if (user.role !== roleCode) {
      throw new BaseError('UNAUTHORIZED', 'You are not authorized to access this resource.', StatusCodes.UNAUTHORIZED);
    }
  }
}
