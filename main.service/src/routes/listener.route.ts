import { listenerController } from '@/container/listener.container';
import { ListnerLoginReq } from '@/dto/listener/request/listener-login.req';
import { ListenerResgisterReq } from '@/dto/listener/request/listener-register.req';
import { ListenerUpdateReq } from '@/dto/listener/request/listener-update.req';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const listenerRouter = express.Router();

listenerRouter

  .delete('/:id', authenticateJWT, checkRole([RoleCodeEnum.ADMIN]), listenerController.delete.bind(listenerController))

  .put(
    '/:id',
    authenticateJWT,
    checkRole([RoleCodeEnum.ADMIN]),
    classValidate(ListenerUpdateReq),
    listenerController.update.bind(listenerController)
  )

  .post('/search', authenticateJWT, checkRole([RoleCodeEnum.ADMIN]), listenerController.search.bind(listenerController))

  .get('/activate/email', listenerController.activateEmail.bind(listenerController).bind(listenerController))

  .post('/exchange-premium', authenticateJWT, listenerController.exchangePremium.bind(listenerController))

  .post('/register', classValidate(ListenerResgisterReq), listenerController.register.bind(listenerController))

  .post('/login', classValidate(ListnerLoginReq), listenerController.login.bind(listenerController))

  .get('/me', authenticateJWT, listenerController.getMe.bind(listenerController))

  .get('/check-is-premium/:listenerId', listenerController.checkIsPremium.bind(listenerController))

  .get('/:id', authenticateJWT, checkRole([RoleCodeEnum.ADMIN]), listenerController.getById.bind(listenerController));

export default listenerRouter;
