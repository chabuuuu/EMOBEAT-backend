import { musicController } from '@/container/music.container';
import { MusicCreateReq } from '@/dto/music/request/music-create.req';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateAnonymous } from '@/middleware/authenticate-anonymous.middleware';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const musicRouter = express.Router();

musicRouter

  .delete(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    musicController.common.delete.bind(musicController.common)
  )

  .get('/:id', authenticateAnonymous, musicController.getById.bind(musicController))

  .put(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(MusicCreateReq),
    musicController.updateById.bind(musicController)
  )

  .post('/quick-search', musicController.quickSearch.bind(musicController))

  .post('/search', musicController.search.bind(musicController))

  .post(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN, RoleCodeEnum.CONTRIBUTOR]),
    classValidate(MusicCreateReq),
    musicController.createNew.bind(musicController)
  );

export default musicRouter;
