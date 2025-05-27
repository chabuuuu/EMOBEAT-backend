import { musicRepository } from '@/container/music.container';
import { recommenderService } from '@/container/recommender.container';
import { StreamQueueController } from '@/controller/stream_queue.controller';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { IRecommenderService } from '@/service/interface/i.recommender.service';
import { IStreamQueueService } from '@/service/interface/i.stream_queue.service';
import { StreamQueueService } from '@/service/stream_queue.service';
import { Container } from 'inversify';

class StreamQueueContainer {
  private container = new Container();
  constructor() {
    this.container.bind<IStreamQueueService>('StreamQueueService').to(StreamQueueService);
    this.container.bind<StreamQueueController>(StreamQueueController).toSelf();

    //Import
    this.container.bind<IRecommenderService>('RecommenderService').toConstantValue(recommenderService);
    this.container.bind<IMusicRepository<any>>('MusicRepository').toConstantValue(musicRepository);
  }

  export() {
    const streamQueueController = this.container.get<StreamQueueController>(StreamQueueController);
    const streamQueueService = this.container.get<IStreamQueueService>('StreamQueueService');

    return { streamQueueController, streamQueueService };
  }
}

const streamQueueContainer = new StreamQueueContainer();
const { streamQueueController, streamQueueService } = streamQueueContainer.export();
export { streamQueueController, streamQueueService };
