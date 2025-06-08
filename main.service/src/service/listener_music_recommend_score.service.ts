import { InteractTypeEnum } from '@/enums/interact-type.enum';
import { ListenerMusicRecommendScore } from '@/models/listener_music_recommend_score.model';
import { Music } from '@/models/music.model';
import { IListenerMusicRecommendScoreRepository } from '@/repository/interface/i.listener_music_recommend_score.repository';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IListenerMusicRecommendScoreService } from '@/service/interface/i.listener_music_recommend_score.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ListenerMusicRecommendScoreService
  extends BaseCrudService<ListenerMusicRecommendScore>
  implements IListenerMusicRecommendScoreService<ListenerMusicRecommendScore>
{
  private listenerMusicRecommendScoreRepository: IListenerMusicRecommendScoreRepository<ListenerMusicRecommendScore>;
  private musicRepository: IMusicRepository<Music>;

  constructor(
    @inject('ListenerMusicRecommendScoreRepository')
    listenerMusicRecommendScoreRepository: IListenerMusicRecommendScoreRepository<ListenerMusicRecommendScore>,
    @inject('MusicRepository')
    musicRepository: IMusicRepository<Music>
  ) {
    super(listenerMusicRecommendScoreRepository);
    this.listenerMusicRecommendScoreRepository = listenerMusicRecommendScoreRepository;
    this.musicRepository = musicRepository;
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

  async interact(mediaId: string, listenerId: number, type: InteractTypeEnum): Promise<void> {
    try {
      const score = this.getWeightedScore(type);

      const music = await this.musicRepository.findOne({
        filter: {
          mediaId: mediaId
        }
      });

      if (!music) {
        console.log(`Music with mediaId ${mediaId} not found.`);
        return;
      }

      const musicId = music.id;

      // Increase listen count for the music
      music.listenCount += 1;
      await this.musicRepository.increaseListenCount(musicId);

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
