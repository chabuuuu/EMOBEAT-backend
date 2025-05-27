import { artistController } from '@/container/artist.container';
import { ArtistCreateReq } from '@/dto/artist/request/artist-create.req';
import { ArtistUpdateReq } from '@/dto/artist/request/artist-update.req';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const artistRouter = express.Router();

artistRouter

  .delete(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    artistController.common.delete.bind(artistController.common)
  )

  .get('/roles', artistController.getRoles.bind(artistController))

  .get('/', artistController.common.findAll.bind(artistController.common))

  .get('/:id', artistController.getById.bind(artistController))

  .put(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(ArtistUpdateReq),
    artistController.updateById.bind(artistController)
  )

  .post('/search', artistController.search.bind(artistController))

  .post(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(ArtistCreateReq),
    artistController.createNew.bind(artistController)
  );

export default artistRouter;
