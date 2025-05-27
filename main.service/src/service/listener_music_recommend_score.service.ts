import { InteractTypeEnum } from '@/enums/interact-type.enum';
import { ListenerMusicRecommendScore } from '@/models/listener_music_recommend_score.model';
import { IListenerMusicRecommendScoreRepository } from '@/repository/interface/i.listener_music_recommend_score.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IListenerMusicRecommendScoreService } from '@/service/interface/i.listener_music_recommend_score.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ListenerMusicRecommendScoreService
  extends BaseCrudService<ListenerMusicRecommendScore>
  implements IListenerMusicRecommendScoreService<ListenerMusicRecommendScore>
{
  private listenerMusicRecommendScoreRepository: IListenerMusicRecommendScoreRepository<ListenerMusicRecommendScore>;

  constructor(
    @inject('ListenerMusicRecommendScoreRepository')
    listenerMusicRecommendScoreRepository: IListenerMusicRecommendScoreRepository<ListenerMusicRecommendScore>
  ) {
    super(listenerMusicRecommendScoreRepository);
    this.listenerMusicRecommendScoreRepository = listenerMusicRecommendScoreRepository;
  }

  getWeightedScore(type: InteractTypeEnum): number {
    switch (type) {
      case InteractTypeEnum.LIKE:
        return 5;
      case InteractTypeEnum.LISTEN:
        return 2;
      case InteractTypeEnum.SEARCH:
        return 1;
      default:
        return 0;
    }
  }

  async interact(musicId: number, listenerId: number, type: InteractTypeEnum): Promise<void> {
    try {
      const score = this.getWeightedScore(type);

      const existingScore = await this.listenerMusicRecommendScoreRepository.findOne({
        filter: { musicId, listenerId }
      });
      if (existingScore) {
        existingScore.score += score;
        await this.listenerMusicRecommendScoreRepository.save(existingScore);
      } else {
        await this.listenerMusicRecommendScoreRepository.create({
          data: {
            musicId,
            listenerId,
            score
          }
        });
      }
    } catch (error) {
      console.log('Error in interact method:', error);
    }
  }
}
