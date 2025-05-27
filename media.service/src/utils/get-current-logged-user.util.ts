import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import BaseError from '@/utils/base.error';

export async function getCurrentLoggedUser(req: any): Promise<JwtClaimDto> {
  const user = req.user;
  if (!user) {
    throw new BaseError('GNR_NOT_LOGGED_IN', 'You are not logged in');
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role
  };
}
