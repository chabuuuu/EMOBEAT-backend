import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { Admin } from '@/models/admin.model';
import { IAdminService } from '@/service/interface/i.admin.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class AdminController {
  public common: IBaseCrudController<Admin>;
  private adminService: IAdminService<Admin>;
  constructor(
    @inject('AdminService') adminService: IAdminService<Admin>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Admin>
  ) {
    this.adminService = adminService;
    this.common = common;
  }

  /**
   * * POST /admin/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.adminService.login(req.body);
      res.send_ok('Login successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * * GET /admin/me
   * * Get current admin information
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getCurrentLoggedUser(req);

      const result = await this.adminService.getMe(user.id);

      res.send_ok('Get current admin information successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
