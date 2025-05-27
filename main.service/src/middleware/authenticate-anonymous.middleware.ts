import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { GeneralException } from '@/exceptions/base/general-exception';
import DefinedError from '@/utils/error/defined.error';
import jwt from 'jsonwebtoken';

export async function authenticateAnonymous(req: any, res: any, next: any) {
  try {
    //Log all header
    console.log('request header:', req.headers);

    let token: string = req.header('Authorization');
    if (!token) {
      // Set as anonymous user
      const anonymousUser: JwtClaimDto = {
        id: 0,
        username: 'anonymous',
        role: RoleCodeEnum.ANONYMOUS
      };
      req.user = anonymousUser;

      return next();
    }
    if (token != null) {
      token = token.split('Bearer ')[1];
    }
    const secretKey = process.env.LOGIN_SECRET || '';
    jwt.verify(token, secretKey, async (err: any, user: any) => {
      if (err) {
        return next(new DefinedError(GeneralException.GNR_NOT_LOGGED_IN));
      }
      console.log('Logged in as:', user);
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
}
