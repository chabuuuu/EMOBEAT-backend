import { ErrorCode } from '@/enums/error-code.enums';
import adminRouter from '@/routes/admin.route';
import albumRouter from '@/routes/album.route';
import artistRouter from '@/routes/artist.route';
import artistFollowerRouter from '@/routes/artist_follower.route';
import categoryRouter from '@/routes/category.route';
import favoriteListRouter from '@/routes/favorite_list.route';
import genreRouter from '@/routes/genre.route';
import instrumentRouter from '@/routes/instrument.route';
import listenerRouter from '@/routes/listener.route';
import listenerAlbumLikeRouter from '@/routes/listener_album_like.route';
import musicRouter from '@/routes/music.route';
import orchestraRouter from '@/routes/orchestra.route';
import periodRouter from '@/routes/period.route';
import recommenderRouter from '@/routes/recommender.route';
import BaseError from '@/utils/error/base.error';
import streamQueueRouter from '@/routes/stream_queue.route';

export function route(app: any, root_api: string) {
  app.use(`${root_api}/admin`, adminRouter);
  app.use(`${root_api}/listener`, listenerRouter);
  app.use(`${root_api}/album`, albumRouter);
  app.use(`${root_api}/artist`, artistRouter);
  app.use(`${root_api}/category`, categoryRouter);
  app.use(`${root_api}/genre`, genreRouter);
  app.use(`${root_api}/instrument`, instrumentRouter);
  app.use(`${root_api}/orchestra`, orchestraRouter);
  app.use(`${root_api}/period`, periodRouter);
  app.use(`${root_api}/music`, musicRouter);
  app.use(`${root_api}/favorite-list`, favoriteListRouter);
  app.use(`${root_api}/follow-artist`, artistFollowerRouter);
  app.use(`${root_api}/album-like`, listenerAlbumLikeRouter);
  app.use(`${root_api}/recommender`, recommenderRouter);
  app.use(`${root_api}/stream-queue`, streamQueueRouter);

  //Health check
  app.get(`${root_api}/health`, (req: any, res: any, next: any) => {
    res.status(200).json({
      status: 'ok',
      message: 'API is running'
    });
  });

  app.all('*', (req: any, res: any, next: any) => {
    const err = new BaseError(ErrorCode.API_NOT_EXISTS, 'API Not Exists');
    next(err);
  });
}
