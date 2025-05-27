import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { Music } from '@/models/music.model';
import { IMusicService } from '@/service/interface/i.music.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { getSearchData } from '@/utils/search/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class MusicController {
  public common: IBaseCrudController<Music>;
  private musicService: IMusicService<Music>;
  constructor(
    @inject('MusicService') musicService: IMusicService<Music>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Music>
  ) {
    this.musicService = musicService;
    this.common = common;
  }

  /**
   * * POST /music/
   */
  async createNew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const musicId = await this.musicService.createNew(req.body);

      res.send_created('Music created successfully', {
        id: musicId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * * PUT /music/:id
   */
  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const makeChangeUser = await getCurrentLoggedUser(req);

      await this.musicService.updateById(Number(req.params.id), req.body);

      res.send_ok('Music updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /music/:id
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const music = await this.musicService.getById(Number(req.params.id));

      res.send_ok('Get music successfully', music);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /music/search
   */
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.musicService.search(searchData);

      res.send_ok('Musics fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /music/quick-search
   */
  async quickSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.musicService.quickSearch(searchData);

      res.send_ok('Musics fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
