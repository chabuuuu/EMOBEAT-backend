import { FavoriteListController } from '@/controller/favorite_list.controller';
import { FavoriteListService } from '@/service/favorite_list.service';
import { FavoriteList } from '@/models/favorite_list.model';
import { FavoriteListRepository } from '@/repository/favorite_list.repository';
import { IFavoriteListService } from '@/service/interface/i.favorite_list.service';
import { IFavoriteListRepository } from '@/repository/interface/i.favorite_list.repository';
import { BaseContainer } from '@/container/base.container';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { musicRepository } from '@/container/music.container';
import { IListenerMusicRecommendScoreService } from '@/service/interface/i.listener_music_recommend_score.service';
import { listenerMusicRecommendScoreService } from '@/container/listener_music_recommend_score.container';

class FavoriteListContainer extends BaseContainer {
  constructor() {
    super(FavoriteList);
    this.container.bind<IFavoriteListService<FavoriteList>>('FavoriteListService').to(FavoriteListService);
    this.container.bind<IFavoriteListRepository<FavoriteList>>('FavoriteListRepository').to(FavoriteListRepository);
    this.container.bind<FavoriteListController>(FavoriteListController).toSelf();

    // Import
    this.container.bind<IMusicRepository<any>>('MusicRepository').toConstantValue(musicRepository);
    this.container
      .bind<IListenerMusicRecommendScoreService<any>>('ListenerMusicRecommendScoreService')
      .toConstantValue(listenerMusicRecommendScoreService);
  }

  export() {
    const favoriteListController = this.container.get<FavoriteListController>(FavoriteListController);
    const favoriteListService = this.container.get<IFavoriteListService<any>>('FavoriteListService');
    const favoriteListRepository = this.container.get<IFavoriteListRepository<any>>('FavoriteListRepository');

    return { favoriteListController, favoriteListService, favoriteListRepository };
  }
}

const favoriteListContainer = new FavoriteListContainer();
const { favoriteListController, favoriteListService, favoriteListRepository } = favoriteListContainer.export();
export { favoriteListController, favoriteListService, favoriteListRepository };
