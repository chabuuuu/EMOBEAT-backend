import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { ListenerAlbumLike } from '@/models/listener_album_like.model';
import { IListenerAlbumLikeService } from '@/service/interface/i.listener_album_like.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { getSearchData } from '@/utils/search/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ListenerAlbumLikeController {
  public common: IBaseCrudController<ListenerAlbumLike>;
  private listenerAlbumLikeService: IListenerAlbumLikeService<ListenerAlbumLike>;
  constructor(
    @inject('ListenerAlbumLikeService') listenerAlbumLikeService: IListenerAlbumLikeService<ListenerAlbumLike>,
    @inject(ITYPES.Controller) common: IBaseCrudController<ListenerAlbumLike>
  ) {
    this.listenerAlbumLikeService = listenerAlbumLikeService;
    this.common = common;
  }

  /**
   * * POST /album-like/like
   */
  async likeAlbum(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { albumId } = req.body;
      const listener = await getCurrentLoggedUser(req);

      await this.listenerAlbumLikeService.likeAlbum(albumId, listener.id);

      res.send_ok('Added to liked list successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * DELETE /album-like/unlike
   */
  async unLikeAlbum(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { albumId } = req.body;
      const listener = await getCurrentLoggedUser(req);

      await this.listenerAlbumLikeService.unLikeAlbum(albumId, listener.id);

      res.send_ok('Unliked successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * * GET /album-like/me
   */
  async myLikedAlbum(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const listener = await getCurrentLoggedUser(req);

      const result = await this.listenerAlbumLikeService.myLikedAlbums(listener.id, searchData);

      res.send_ok('My liked list fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
