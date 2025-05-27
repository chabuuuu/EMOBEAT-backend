import { adminController } from '@/container/admin.container';
import { LoginAdminReq } from '@/dto/admin/request/login-admin.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const adminRouter = express.Router();

adminRouter

  .get('/me', authenticateJWT, adminController.getMe.bind(adminController))

  .post('/login', classValidate(LoginAdminReq), adminController.login.bind(adminController));

export default adminRouter;
