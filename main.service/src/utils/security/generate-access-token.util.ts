import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import jwt from 'jsonwebtoken';
import { TIME_CONSTANTS } from '@/constants/time.constants';
import _ from 'lodash';
import { RoleCodeEnum } from '@/enums/role-code.enum';

export async function generateAccessToken(userId: number, username: string, roleCode: RoleCodeEnum): Promise<string> {
  const jwtClaim = new JwtClaimDto(userId, username, roleCode);

  const secretKey = process.env.LOGIN_SECRET || '';

  const token = jwt.sign(_.toPlainObject(jwtClaim), secretKey, {
    expiresIn: TIME_CONSTANTS.DAY * 3
  });

  return token;
}
