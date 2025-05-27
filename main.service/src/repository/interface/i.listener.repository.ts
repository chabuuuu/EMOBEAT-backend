import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IListenerRepository<T> extends IBaseRepository<T> {
  incrementPoints(listenerId: number, points: number): Promise<void>;
}
