import { MUSIC_PLAYED_DTO } from '@/dto/producer/MUSIC_PLAYED.dto';
import { ITrackingService } from '@/service/interface/i.tracking.service';
import redis from '@/utils/redis/redis.util';
import { injectable } from 'inversify';

@injectable()
export class TrackingService implements ITrackingService {
  async trackMusicPlayed(mediaId: string, listenerId: number): Promise<void> {
    const MUSIC_PLAYED_DTO: MUSIC_PLAYED_DTO = {
      mediaId,
      listenerId
    };
    const message = JSON.stringify(MUSIC_PLAYED_DTO);
    redis.publish('MUSIC_PLAYED', message);
    console.log('Sent message to Redis MUSIC_PLAYED:', message);
  }
}
