import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { FavoriteList } from '@/models/favorite_list.model';
import { IFavoriteListService } from '@/service/interface/i.favorite_list.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { getSearchData } from '@/utils/search/get-search-data.util';
import { SecurityRoleUtil } from '@/utils/security/security-role.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class FavoriteListController {
  public common: IBaseCrudController<FavoriteList>;
  private favoriteListService: IFavoriteListService<FavoriteList>;
  constructor(
    @inject('FavoriteListService') favoriteListService: IFavoriteListService<FavoriteList>,
    @inject(ITYPES.Controller) common: IBaseCrudController<FavoriteList>
  ) {
    this.favoriteListService = favoriteListService;
    this.common = common;
  }

  /**
   * * DELETE /favorite-list/remove
   */
  async removeFromFavoriteList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { musicId } = req.body;
      const listener = await getCurrentLoggedUser(req);

      await this.favoriteListService.removeFromFavoriteList(musicId, listener.id);

      res.send_ok('Removed from favorite list successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /favorite-list/add
   */
  async addToFavoriteList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { musicId } = req.body;
      const listener = await getCurrentLoggedUser(req);

      await this.favoriteListService.addToFavoriteList(musicId, listener.id);

      res.send_ok('Added to favorite list successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * * GET /favorite-list/me
   */
  async myFavoriteList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const listener = await getCurrentLoggedUser(req);

      const result = await this.favoriteListService.myFavoriteList(listener.id, searchData);

      res.send_ok('My favorite list fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
