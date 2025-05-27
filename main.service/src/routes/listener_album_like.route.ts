import { listenerAlbumLikeController } from '@/container/listener_album_like.container';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import express from 'express';
const listenerAlbumLikeRouter = express.Router();

listenerAlbumLikeRouter

  .delete(
    '/unlike',
    authenticateJWT,
    checkRole([RoleCodeEnum.LISTENER]),
    listenerAlbumLikeController.unLikeAlbum.bind(listenerAlbumLikeController)
  )

  .post(
    '/me',
    authenticateJWT,
    checkRole([RoleCodeEnum.LISTENER]),
    listenerAlbumLikeController.myLikedAlbum.bind(listenerAlbumLikeController)
  )

  .post(
    '/like',
    authenticateJWT,
    checkRole([RoleCodeEnum.LISTENER]),
    listenerAlbumLikeController.likeAlbum.bind(listenerAlbumLikeController)
  );

export default listenerAlbumLikeRouter;
