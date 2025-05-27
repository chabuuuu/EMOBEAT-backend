import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import { GeneralException } from '@/exceptions/base/general-exception';
import DefinedError from '@/utils/error/defined.error';
import { Request } from 'express';

export async function getCurrentLoggedUser(req: Request): Promise<JwtClaimDto> {
  const user = req.user;
  if (!user) {
    throw new DefinedError(GeneralException.GNR_NOT_LOGGED_IN);
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role
  };
}
