import { listenerMusicRecommendScoreService } from '@/container/listener_music_recommend_score.container';
import { MUSIC_PLAYED_DTO } from '@/dto/consumer/MUSIC_PLAYED.dto';
import { InteractTypeEnum } from '@/enums/interact-type.enum';
import redisSubscriber from '@/utils/redis/redis-subcriber.util';

export class MusicConsumer {
  constructor() {
    MusicConsumer.init();
  }

  static init() {
    this.MUSIC_PLAYED();
  }

  static async MUSIC_PLAYED() {
    await redisSubscriber.subscribe('MUSIC_PLAYED');

    redisSubscriber.on('message', (channel, message) => {
      if (channel === 'MUSIC_PLAYED') {
        try {
          const payload: MUSIC_PLAYED_DTO = JSON.parse(message);
          const { musicId, listenerId } = payload;
          // Xử lý logic khi nhận sự kiện MUSIC_PLAYED
          console.log('MUSIC_PLAYED event:', { musicId, listenerId });

          // Gọi service để xử lý tương tác
          listenerMusicRecommendScoreService.interact(musicId, listenerId, InteractTypeEnum.LISTEN);
        } catch (err) {
          console.error('Invalid MUSIC_PLAYED payload:', message);
        }
      }
    });

    console.log('MUSIC_PLAYED consumer initialized');
  }
}
