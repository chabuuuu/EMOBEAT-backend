import { instrumentController } from '@/container/instrument.container';
import { InstrumentCreateReq } from '@/dto/instrument/instrument-create.req';
import { InstrumentUpdateReq } from '@/dto/instrument/instrument-update.req';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const instrumentRouter = express.Router();

instrumentRouter
  .get('/:id', instrumentController.common.findOne.bind(instrumentController.common))

  .get('/', instrumentController.common.findAll.bind(instrumentController.common))

  .delete(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    instrumentController.common.delete.bind(instrumentController.common)
  )

  .put(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(InstrumentUpdateReq),
    instrumentController.common.update.bind(instrumentController.common)
  )

  .post('/search', instrumentController.common.searchBase.bind(instrumentController.common))

  .post(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(InstrumentCreateReq),
    instrumentController.common.create.bind(instrumentController.common)
  );

export default instrumentRouter;
