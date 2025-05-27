import { StreamQueueCache } from '@/dto/stream-queue/cache/stream-queue.cache';

export class GetQueueRes {
  streamQueue!: StreamQueueCache[];
  currentPlaying!: {
    musicId: number;
    index: number;
  };
}
