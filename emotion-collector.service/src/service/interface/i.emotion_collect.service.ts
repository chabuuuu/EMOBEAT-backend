import { EmotionCollectReq } from '@/dto/emotion_collect/request/emotion_collect.req';
import { IBaseCrudService } from '@/service/interface/i.base.service';

export interface IEmotionCollectService<T> extends IBaseCrudService<T> {
  collect(emotionCollect: EmotionCollectReq): Promise<void>;
}
