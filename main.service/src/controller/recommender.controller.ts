import { IRecommenderService } from '@/service/interface/i.recommender.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class RecommenderController {
  private recommenderService: IRecommenderService;
  constructor(@inject('RecommenderService') recommenderService: IRecommenderService) {
    this.recommenderService = recommenderService;
  }

  /**
   * * GET /recommender/songs
   */
  async getRecommendedSongs(req: Request, res: Response, next: NextFunction) {
    try {
      const listener = await getCurrentLoggedUser(req);
      const topN = parseInt(req.query.topN as string) || 10;

      const recommendedSongs = await this.recommenderService.getRecommendedSongs(listener.id, topN);

      res.send_ok('Recommended songs retrieved successfully', recommendedSongs);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /recommender/popular-albums
   */
  async getPopularAlbums(req: Request, res: Response, next: NextFunction) {
    try {
      const listener = await getCurrentLoggedUser(req);
      const topN = parseInt(req.query.topN as string) || 10;

      const popularAlbums = await this.recommenderService.getPopularAlbums(listener.id, topN);

      res.send_ok('Popular albums retrieved successfully', popularAlbums);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /recommender/top-artist-today
   */
  async getTopArtistToday(req: Request, res: Response, next: NextFunction) {
    try {
      const topN = parseInt(req.query.topN as string) || 10;

      const topArtist = await this.recommenderService.getTopArtistToday(topN);

      res.send_ok('Top artist of the day retrieved successfully', topArtist);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /recommender/instrument-spotlight
   */
  async getInstrumentSpotlight(req: Request, res: Response, next: NextFunction) {
    try {
      const topN = parseInt(req.query.topN as string) || 10;

      const instrumentSpotlight = await this.recommenderService.getInstrumentSpotlight(topN);

      res.send_ok('Instrument spotlight retrieved successfully', instrumentSpotlight);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /recommender/eras-and-styles
   */
  async getErasAndStyles(req: Request, res: Response, next: NextFunction) {
    try {
      const listener = await getCurrentLoggedUser(req);
      const topN = parseInt(req.query.topN as string) || 10;

      const erasAndStyles = await this.recommenderService.getErasAndStyles(listener.id, topN);

      res.send_ok('Eras and styles retrieved successfully', erasAndStyles);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /recommender/random-artist
   */
  async getRandomArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const randomArtist = await this.recommenderService.getRandomArtist();

      res.send_ok('Random artist retrieved successfully', randomArtist);
    } catch (error) {
      next(error);
    }
  }
}
