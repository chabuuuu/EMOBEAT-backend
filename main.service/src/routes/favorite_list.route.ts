import { favoriteListController } from '@/container/favorite_list.container';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import express from 'express';
const favoriteListRouter = express.Router();

favoriteListRouter

  .get(
    '/check/:musicId',
    authenticateJWT,
    checkRole([RoleCodeEnum.LISTENER]),
    favoriteListController.checkInFavoriteList.bind(favoriteListController)
  )

  .delete(
    '/remove',
    authenticateJWT,
    checkRole([RoleCodeEnum.LISTENER]),
    favoriteListController.removeFromFavoriteList.bind(favoriteListController)
  )

  .post(
    '/me',
    authenticateJWT,
    checkRole([RoleCodeEnum.LISTENER]),
    favoriteListController.myFavoriteList.bind(favoriteListController)
  )

  .post(
    '/add',
    authenticateJWT,
    checkRole([RoleCodeEnum.LISTENER]),
    favoriteListController.addToFavoriteList.bind(favoriteListController)
  );

export default favoriteListRouter;
