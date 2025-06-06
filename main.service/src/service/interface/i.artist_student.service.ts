import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IArtistStudentService<T extends BaseModelType> extends IBaseCrudService<T> {}