import { StreamQueueCache } from '@/dto/stream-queue/cache/stream-queue.cache';
import { GetQueueRes } from '@/dto/stream-queue/response/get-queue.res';
import { RedisSchemaEnum } from '@/enums/redis-schema.enum';
import { Music } from '@/models/music.model';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { IRecommenderService } from '@/service/interface/i.recommender.service';
import { IStreamQueueService } from '@/service/interface/i.stream_queue.service';
import redis from '@/utils/redis/redis.util';
import { inject, injectable } from 'inversify';

@injectable()
export class StreamQueueService implements IStreamQueueService {
  private recommenderService: IRecommenderService;
  private musicRepository: IMusicRepository<Music>;
  private MAX_TOTAL_MUSIC_IN_QUEUE = 10; // Maximum number of music in the queue
  private TOTAL_MUSIC_AT_LEAST_IN_NEXT_QUEUE = 3; // Minimum number of music in the queue

  constructor(
    @inject('RecommenderService') recommenderService: IRecommenderService,
    @inject('MusicRepository') musicRepository: IMusicRepository<Music>
  ) {
    this.recommenderService = recommenderService;
    this.musicRepository = musicRepository;
  }

  async nextTrack(listenerId: number, musicId: number): Promise<GetQueueRes> {
    const queueKey = this.getQueueKey(listenerId);

    const currentQueue = await this.getQueue(listenerId);

    // Find the index of the current music in the queue
    let currentMusicIndex = -1;
    for (let i = currentQueue.length - 1; i >= 0; i--) {
      if (currentQueue[i].music.id === musicId) {
        currentMusicIndex = i;
        break;
      }
    }

    // Get total music in next queue
    const totalMusicInNextQueue = currentQueue.length - currentMusicIndex - 1;

    // Get total music need to be recommended
    const totalMusicNeedToBeRecommended = this.TOTAL_MUSIC_AT_LEAST_IN_NEXT_QUEUE - totalMusicInNextQueue;

    // Get recommend songs (exclude the current queue)
    if (totalMusicNeedToBeRecommended > 0) {
      const recommendedSongs = await this.recommenderService.getRecommendedSongsExclude(
        listenerId,
        totalMusicNeedToBeRecommended,
        currentQueue.map((item) => item.music.id)
      );

      if (recommendedSongs.length > 0) {
        // Add the recommended songs to the queue
        await redis.rpush(queueKey, ...recommendedSongs.map((item) => JSON.stringify({ music: item })));

        // Return the queue after adding the recommended songs
        currentQueue.push(
          ...recommendedSongs.map((item) => {
            return {
              music: item
            };
          })
        );
      }
    }

    return {
      streamQueue: currentQueue,
      currentPlaying: {
        musicId: musicId,
        index: currentMusicIndex
      }
    };
  }

  async prevTrack(listenerId: number, musicId: number): Promise<GetQueueRes> {
    const queueKey = this.getQueueKey(listenerId);

    const currentQueue = await this.getQueue(listenerId);

    // Find the index of the current music in the queue
    let currentMusicIndex = -1;
    for (let i = currentQueue.length - 1; i >= 0; i--) {
      if (currentQueue[i].music.id === musicId) {
        currentMusicIndex = i;
        break;
      }
    }

    // Get the previous music in the queue
    const previousMusic = currentQueue[currentMusicIndex];

    console.log('previousMusic', previousMusic);

    return {
      streamQueue: currentQueue,
      currentPlaying: {
        musicId: previousMusic.music.id,
        index: currentMusicIndex
      }
    };
  }

  private getQueueKey(listenerId: number): string {
    return `${RedisSchemaEnum.StreamQueue}:${listenerId}`;
  }

  async addToQueue(listenerId: number, musicId: number): Promise<GetQueueRes> {
    const queueKey = this.getQueueKey(listenerId);
    const music = await this.musicRepository.findMusicToAddToQueue(musicId);

    if (!music) {
      throw new Error('Music not found or not approved');
    }

    await redis.rpush(queueKey, JSON.stringify({ music: music }));
    await redis.expire(queueKey, 60 * 60 * 3); // 3h

    const currentQueue = await this.getQueue(listenerId);

    let currentIndex = 0;

    if (currentQueue.length <= 1) {
      currentIndex = 0;
    } else {
      // Find the index of the current music in the queue
      for (let i = 0; i < currentQueue.length; i++) {
        if (currentQueue[i].music.id === musicId) {
          currentIndex = i;
          break;
        }
      }
    }

    // Calculate the number of music that need to be recommended
    const totalMusicInQueue = currentQueue.length;
    const totalMusicNeedToBeRecommended = this.MAX_TOTAL_MUSIC_IN_QUEUE - totalMusicInQueue;

    // If the queue is full, remove the oldest music
    if (totalMusicInQueue > this.MAX_TOTAL_MUSIC_IN_QUEUE) {
      // Remove the oldest music from the queue
      await redis.lpop(queueKey);
    }

    // Get recommend songs (exclude the current queue)
    if (totalMusicNeedToBeRecommended > 0) {
      const recommendedSongs = await this.recommenderService.getRecommendedSongsExclude(
        listenerId,
        totalMusicNeedToBeRecommended,
        currentQueue.map((item) => item.music.id)
      );

      // Add the recommended songs to the queue
      if (recommendedSongs.length > 0) {
        await redis.rpush(queueKey, ...recommendedSongs.map((item) => JSON.stringify({ music: item })));

        // Return the queue after adding the recommended songs
        currentQueue.push(
          ...recommendedSongs.map((item) => {
            return {
              music: item
            };
          })
        );
      }
    }

    return {
      streamQueue: currentQueue,
      currentPlaying: {
        musicId: musicId,
        index: currentIndex
      }
    };
  }

  async getQueue(listenerId: number): Promise<StreamQueueCache[]> {
    const queue = await redis.lrange(this.getQueueKey(listenerId), 0, -1);

    const queueData = queue.map((item) => JSON.parse(item) as StreamQueueCache);

    return queueData;
  }
}
