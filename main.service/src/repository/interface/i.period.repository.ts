import { ErasAndStylesRes } from '@/dto/recommender/response/eras-and-styles.res';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IPeriodRepository<T> extends IBaseRepository<T> {
  getErasAndStyles(topN: number): Promise<ErasAndStylesRes[]>;
}
