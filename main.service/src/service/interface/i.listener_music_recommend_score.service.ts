import { InteractTypeEnum } from '@/enums/interact-type.enum';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IListenerMusicRecommendScoreService<T extends BaseModelType> extends IBaseCrudService<T> {
  interact(mediaId: string, listenerId: number, type: InteractTypeEnum): Promise<void>;
}
