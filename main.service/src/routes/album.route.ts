import { albumController } from '@/container/album.container';
import { AlbumCreateReq } from '@/dto/album/request/album-create.req';
import { AlbumUpdateReq } from '@/dto/album/request/album-update.req';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const albumRouter = express.Router();

albumRouter

  .get('/:id', albumController.common.findOne.bind(albumController.common))

  .get('/', albumController.common.findAll.bind(albumController.common))

  .put(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(AlbumUpdateReq),
    albumController.updateById.bind(albumController)
  )

  .delete(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    albumController.common.delete.bind(albumController.common)
  )

  .post('/search', albumController.search.bind(albumController))

  .post(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(AlbumCreateReq),
    albumController.createNew.bind(albumController)
  );

export default albumRouter;
