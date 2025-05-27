import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { RoleCodeEnum } from '@/enums/role-code.enum';
import { Album } from '@/models/album.model';
import { IAlbumService } from '@/service/interface/i.album.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { getSearchData } from '@/utils/search/get-search-data.util';
import { SecurityRoleUtil } from '@/utils/security/security-role.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class AlbumController {
  public common: IBaseCrudController<Album>;
  private albumService: IAlbumService<Album>;
  constructor(
    @inject('AlbumService') albumService: IAlbumService<Album>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Album>
  ) {
    this.albumService = albumService;
    this.common = common;
  }

  /**
   * * POST /album
   */
  async createNew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admin = await getCurrentLoggedUser(req);

      const createdAlbumId = await this.albumService.createNew(req.body, admin.id);

      res.send_ok('Created successfully', {
        id: createdAlbumId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * * UPDATE /album/:id
   */
  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admin = await getCurrentLoggedUser(req);

      await this.albumService.updateById(Number(req.params.id), req.body, admin.id);

      res.send_ok('Updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /album/search
   */
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.albumService.search(searchData);

      res.send_ok('Albums fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
