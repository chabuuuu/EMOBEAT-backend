import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import { GeneralException } from '@/exceptions/base/general-exception';
import DefinedError from '@/utils/error/defined.error';

export const checkRole = (roles: string[]) => (req: any, res: any, next: any) => {
  try {
    const user: JwtClaimDto = req.user;
    const userRole = user.role;

    const hasPermission = roles.some((role) => userRole === role);

    if (!hasPermission) {
      throw new DefinedError(GeneralException.GNR_NOT_HAVE_PERMISSION);
    }
    next();
  } catch (error) {
    next(error);
  }
};
