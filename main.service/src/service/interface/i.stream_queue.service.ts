import { StreamQueueCache } from '@/dto/stream-queue/cache/stream-queue.cache';
import { GetQueueRes } from '@/dto/stream-queue/response/get-queue.res';

export interface IStreamQueueService {
  /**
   * Add a music to the stream queue of a listener
   * And also return the updated stream queue
   * @param listenerId
   * @param musicId
   */
  addToQueue(listenerId: number, musicId: number): Promise<GetQueueRes>;

  getQueue(listenerId: number): Promise<StreamQueueCache[]>;

  nextTrack(listenerId: number, musicId: number): Promise<GetQueueRes>;

  prevTrack(listenerId: number, musicId: number): Promise<GetQueueRes>;
}
