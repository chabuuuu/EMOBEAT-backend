import { InstrumentSpotlightRes } from '@/dto/recommender/response/instrument-spotlight.res';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IInstrumentRepository<T> extends IBaseRepository<T> {
  getInstrumentSpotlight(topN: number): Promise<InstrumentSpotlightRes[]>;
}
