import { albumRepository } from '@/container/album.container';
import { artistRepository } from '@/container/artist.container';
import { artistFollowerRepository } from '@/container/artist_follower.container';
import { instrumentRepository } from '@/container/instrument.container';
import { musicRepository } from '@/container/music.container';
import { periodRepository } from '@/container/period.container';
import { RecommenderController } from '@/controller/recommender.controller';
import { IAlbumRepository } from '@/repository/interface/i.album.repository';
import { IArtistRepository } from '@/repository/interface/i.artist.repository';
import { IArtistFollowerRepository } from '@/repository/interface/i.artist_follower.repository';
import { IInstrumentRepository } from '@/repository/interface/i.instrument.repository';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { IPeriodRepository } from '@/repository/interface/i.period.repository';
import { IRecommenderService } from '@/service/interface/i.recommender.service';
import { RecommenderService } from '@/service/recommender.service';
import { Container } from 'inversify';

class RecommenderContainer {
  private container = new Container();
  constructor() {
    this.container.bind<IRecommenderService>('RecommenderService').to(RecommenderService);
    this.container.bind<RecommenderController>(RecommenderController).toSelf();

    // Import
    this.container.bind<IMusicRepository<any>>('MusicRepository').toConstantValue(musicRepository);
    this.container.bind<IAlbumRepository<any>>('AlbumRepository').toConstantValue(albumRepository);
    this.container
      .bind<IArtistFollowerRepository<any>>('ArtistFollowerRepository')
      .toConstantValue(artistFollowerRepository);
    this.container.bind<IInstrumentRepository<any>>('InstrumentRepository').toConstantValue(instrumentRepository);
    this.container.bind<IPeriodRepository<any>>('PeriodRepository').toConstantValue(periodRepository);
    this.container.bind<IArtistRepository<any>>('ArtistRepository').toConstantValue(artistRepository);
  }

  export() {
    const recommenderController = this.container.get<RecommenderController>(RecommenderController);
    const recommenderService = this.container.get<IRecommenderService>('RecommenderService');

    return { recommenderController, recommenderService };
  }
}

const recommenderContainer = new RecommenderContainer();
const { recommenderController, recommenderService } = recommenderContainer.export();
export { recommenderController, recommenderService };
