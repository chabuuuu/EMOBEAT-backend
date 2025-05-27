import { periodController } from '@/container/period.container';
import { PeriodCreateReq } from '@/dto/period/period-create.req';
import { PeriodUpdateReq } from '@/dto/period/period-update.req';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const periodRouter = express.Router();

periodRouter

  .delete(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    periodController.common.delete.bind(periodController.common)
  )

  .put(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(PeriodUpdateReq),
    periodController.common.update.bind(periodController.common)
  )

  .post('/search', periodController.common.searchBase.bind(periodController.common))

  .post(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(PeriodCreateReq),
    periodController.common.create.bind(periodController.common)
  )

  .get('/:id', periodController.common.findOne.bind(periodController.common))

  .get('/', periodController.common.findAll.bind(periodController.common));

export default periodRouter;
