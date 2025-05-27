import BaseError from '@/utils/base.error';
import jwt from 'jsonwebtoken';

export async function authenticateJWT(req: any, res: any, next: any) {
  try {
    //Log all header
    console.log('request header:', req.headers);

    let token: string = req.header('Authorization');
    if (!token) {
      throw new BaseError('GNR_NOT_LOGGED_IN', 'You are not logged in');
    }
    if (token != null) {
      token = token.split('Bearer ')[1];
    }
    const secretKey = process.env.LOGIN_SECRET || '';
    jwt.verify(token, secretKey, async (err: any, user: any) => {
      if (err) {
        return next(new BaseError('GNR_NOT_LOGGED_IN', 'You are not logged in'));
      }
      console.log('Logged in as:', user);
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
}
