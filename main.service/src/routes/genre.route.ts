import { genreController } from '@/container/genre.container';
import { GenreCreateReq } from '@/dto/genre/genre-create.req';
import { GenreUpdateReq } from '@/dto/genre/genre-update.req';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const genreRouter = express.Router();

genreRouter
  .get('/:id', genreController.common.findOne.bind(genreController.common))

  .get('/', genreController.common.findAll.bind(genreController.common))

  .delete(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    genreController.common.delete.bind(genreController.common)
  )

  .put(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(GenreUpdateReq),
    genreController.common.update.bind(genreController.common)
  )

  .post('/search', genreController.common.searchBase.bind(genreController.common))

  .post(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(GenreCreateReq),
    genreController.common.create.bind(genreController.common)
  );

export default genreRouter;
