import { ARTIST_ROLES } from '@/constants/artist-role.constants';
import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { Artist } from '@/models/artist.model';
import { IArtistService } from '@/service/interface/i.artist.service';
import { ITYPES } from '@/types/interface.types';
import { getSearchData } from '@/utils/search/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ArtistController {
  public common: IBaseCrudController<Artist>;
  private artistService: IArtistService<Artist>;
  constructor(
    @inject('ArtistService') artistService: IArtistService<Artist>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Artist>
  ) {
    this.artistService = artistService;
    this.common = common;
  }

  /**
   * * POST /artist/search
   */
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.artistService.search(searchData);

      res.send_ok('Artists fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * UPDATE /artist/:id
   */
  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.artistService.updateById(Number(req.params.id), req.body);

      res.send_ok('Updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /artist
   */
  async createNew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createdAlbumId = await this.artistService.createNew(req.body);

      res.send_ok('Created successfully', {
        id: createdAlbumId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /artist/:id
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.artistService.getById(Number(req.params.id));

      res.send_ok('Get successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /artist/roles
   */
  async getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.send_ok('Get successfully', ARTIST_ROLES);
    } catch (error) {
      next(error);
    }
  }
}
