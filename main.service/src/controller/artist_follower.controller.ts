import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { ArtistFollower } from '@/models/artist_follower.model';
import { IArtistFollowerService } from '@/service/interface/i.artist_follower.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { getSearchData } from '@/utils/search/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ArtistFollowerController {
  public common: IBaseCrudController<ArtistFollower>;
  private artistFollowerService: IArtistFollowerService<ArtistFollower>;
  constructor(
    @inject('ArtistFollowerService') artistFollowerService: IArtistFollowerService<ArtistFollower>,
    @inject(ITYPES.Controller) common: IBaseCrudController<ArtistFollower>
  ) {
    this.artistFollowerService = artistFollowerService;
    this.common = common;
  }

  /**
   * * POST /follow-artist/folow
   */
  async followArtist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { artistId } = req.body;
      const listener = await getCurrentLoggedUser(req);

      await this.artistFollowerService.followArtist(artistId, listener.id);

      res.send_ok('Follow artist successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * DELETE /follow-artist/unfolow
   */
  async unFollowArtist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { artistId } = req.body;
      const listener = await getCurrentLoggedUser(req);

      await this.artistFollowerService.unFollowArtist(artistId, listener.id);

      res.send_ok('Unfollow artist successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * * GET /follow-artist/me
   */
  async myFollowedArtist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const listener = await getCurrentLoggedUser(req);

      const result = await this.artistFollowerService.myFollowedArtists(listener.id, searchData);

      res.send_ok('My followed artist list fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
