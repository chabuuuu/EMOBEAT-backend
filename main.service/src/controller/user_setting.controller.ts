import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { UserSetting } from '@/models/user_setting.model';
import { IUserSettingService } from '@/service/interface/i.user_setting.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UserSettingController {
  public common: IBaseCrudController<UserSetting>;
  private userSettingService: IUserSettingService<UserSetting>;
  constructor(
    @inject('UserSettingService') userSettingService: IUserSettingService<UserSetting>,
    @inject(ITYPES.Controller) common: IBaseCrudController<UserSetting>
  ) {
    this.userSettingService = userSettingService;
    this.common = common;
  }

  /**
   * * GET /user-settings
   */
  async getMyUserSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getCurrentLoggedUser(req);

      const userSetting = await this.userSettingService.getMyUserSetting(user.id);

      res.send_ok('Get user setting successfully', userSetting);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * PUT /user-settings
   */
  async updateMyUserSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getCurrentLoggedUser(req);

      const updatedUserSetting = await this.userSettingService.updateMyUserSetting(user.id, req.body);

      res.send_ok('Update user setting successfully', updatedUserSetting);
    } catch (error) {
      next(error);
    }
  }
}
