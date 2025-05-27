import { orchestraController } from '@/container/orchestra.container';
import { OrchestraCreateReq } from '@/dto/orchestra/orchestra-create.req';
import { OrchestraUpdateReq } from '@/dto/orchestra/orchestra-update.req';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const orchestraRouter = express.Router();

orchestraRouter

  .delete(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    orchestraController.common.delete.bind(orchestraController.common)
  )

  .put(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(OrchestraUpdateReq),
    orchestraController.common.update.bind(orchestraController.common)
  )

  .post('/search', orchestraController.common.searchBase.bind(orchestraController.common))

  .post(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(OrchestraCreateReq),
    orchestraController.common.create.bind(orchestraController.common)
  )

  .get('/:id', orchestraController.common.findOne.bind(orchestraController.common))

  .get('/', orchestraController.common.findAll.bind(orchestraController.common));

export default orchestraRouter;
