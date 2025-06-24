import { userSettingController } from '@/container/user_setting.container';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkRole } from '@/middleware/check-role.middleware';
import express from 'express';
const userSettingRouter = express.Router();

userSettingRouter

  .put(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.LISTENER]),
    userSettingController.updateMyUserSetting.bind(userSettingController)
  )

  .get(
    '/',
    authenticateJWT,
    checkRole([RoleCodeEnum.LISTENER]),
    userSettingController.getMyUserSetting.bind(userSettingController)
  );

export default userSettingRouter;
