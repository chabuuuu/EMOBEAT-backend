import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { Listener } from '@/models/listener.model';
import { IListenerService } from '@/service/interface/i.listener.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { getSearchData } from '@/utils/search/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ListenerController {
  public common: IBaseCrudController<Listener>;
  private listenerService: IListenerService<Listener>;
  constructor(
    @inject('ListenerService') listenerService: IListenerService<Listener>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Listener>
  ) {
    this.listenerService = listenerService;
    this.common = common;
  }

  /**
   * * POST /listener/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.listenerService.login(req.body);
      res.send_ok('Login successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * * GET /listener/me
   * * Get current listener information
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await getCurrentLoggedUser(req);

      const result = await this.listenerService.getMe(user.id);

      res.send_ok('Get current listener information successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /listener/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.listenerService.register(req.body);
      res.send_ok('The otp have been sent to your email', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /listener/activate/email
   */
  async activateEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.query as {
        email: string;
        otp: string;
      };

      await this.listenerService.activateEmail(email, otp);
      res.send_ok('Activate email successfully, you can login now');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /listener/search
   * @param req
   * @param res
   * @param next
   */
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.listenerService.search(searchData);

      res.send_ok('Listeners fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /listener/:id
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      const result = await this.listenerService.getById(id);

      res.send_ok('Listener fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * DELETE /listener/:id
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      const result = await this.listenerService.findOneAndDelete({
        filter: {
          id: id
        }
      });

      res.send_ok('Listener deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * PUT /listener/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      const result = await this.listenerService.updateById(id, req.body);

      res.send_ok('Listener updated successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
