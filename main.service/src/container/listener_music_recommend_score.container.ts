import { ListenerMusicRecommendScoreController } from '@/controller/listener_music_recommend_score.controller';
import { ListenerMusicRecommendScoreService } from '@/service/listener_music_recommend_score.service';
import { ListenerMusicRecommendScore } from '@/models/listener_music_recommend_score.model';
import { ListenerMusicRecommendScoreRepository } from '@/repository/listener_music_recommend_score.repository';
import { IListenerMusicRecommendScoreService } from '@/service/interface/i.listener_music_recommend_score.service';
import { IListenerMusicRecommendScoreRepository } from '@/repository/interface/i.listener_music_recommend_score.repository';
import { BaseContainer } from '@/container/base.container';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { Music } from '@/models/music.model';
import { musicRepository } from '@/container/music.container';

class ListenerMusicRecommendScoreContainer extends BaseContainer {
  constructor() {
    super(ListenerMusicRecommendScore);
    this.container
      .bind<IListenerMusicRecommendScoreService<ListenerMusicRecommendScore>>('ListenerMusicRecommendScoreService')
      .to(ListenerMusicRecommendScoreService);
    this.container
      .bind<
        IListenerMusicRecommendScoreRepository<ListenerMusicRecommendScore>
      >('ListenerMusicRecommendScoreRepository')
      .to(ListenerMusicRecommendScoreRepository);
    this.container.bind<ListenerMusicRecommendScoreController>(ListenerMusicRecommendScoreController).toSelf();

    // Import
    this.container.bind<IMusicRepository<Music>>('MusicRepository').toConstantValue(musicRepository);
  }

  export() {
    const listenerMusicRecommendScoreController = this.container.get<ListenerMusicRecommendScoreController>(
      ListenerMusicRecommendScoreController
    );
    const listenerMusicRecommendScoreService = this.container.get<IListenerMusicRecommendScoreService<any>>(
      'ListenerMusicRecommendScoreService'
    );
    const listenerMusicRecommendScoreRepository = this.container.get<IListenerMusicRecommendScoreRepository<any>>(
      'ListenerMusicRecommendScoreRepository'
    );

    return {
      listenerMusicRecommendScoreController,
      listenerMusicRecommendScoreService,
      listenerMusicRecommendScoreRepository
    };
  }
}

const listenerMusicRecommendScoreContainer = new ListenerMusicRecommendScoreContainer();
const {
  listenerMusicRecommendScoreController,
  listenerMusicRecommendScoreService,
  listenerMusicRecommendScoreRepository
} = listenerMusicRecommendScoreContainer.export();
export {
  listenerMusicRecommendScoreController,
  listenerMusicRecommendScoreService,
  listenerMusicRecommendScoreRepository
};
