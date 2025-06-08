import { EmotionCollectController } from '@/controller/emotion_collect.controller';
import { EmotionCollectService } from '@/service/emotion_collect.service';
import { EmotionCollect } from '@/models/emotion_collect.model';
import { EmotionCollectRepository } from '@/repository/emotion_collect.repository';
import { IEmotionCollectService } from '@/service/interface/i.emotion_collect.service';
import { IEmotionCollectRepository } from '@/repository/interface/i.emotion_collect.repository';
import { BaseContainer } from '@/container/base.container';

class EmotionCollectContainer extends BaseContainer {
  constructor() {
    super(EmotionCollect);
this.container.bind<IEmotionCollectService<EmotionCollect>>('EmotionCollectService').to(EmotionCollectService);
this.container.bind<IEmotionCollectRepository<EmotionCollect>>('EmotionCollectRepository').to(EmotionCollectRepository);
this.container.bind<EmotionCollectController>(EmotionCollectController).toSelf();
}

export() {
    const emotionCollectController = this.container.get<EmotionCollectController>(EmotionCollectController);
    const emotionCollectService = this.container.get<IEmotionCollectService<any>>('EmotionCollectService');
    const emotionCollectRepository = this.container.get<IEmotionCollectRepository<any>>('EmotionCollectRepository');

return { emotionCollectController, emotionCollectService, emotionCollectRepository };
}
}

const emotionCollectContainer = new EmotionCollectContainer();
const { emotionCollectController, emotionCollectService,emotionCollectRepository } = emotionCollectContainer.export();
export { emotionCollectController, emotionCollectService, emotionCollectRepository };