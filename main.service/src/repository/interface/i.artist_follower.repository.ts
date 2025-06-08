import { Artist } from '@/models/artist.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IArtistFollowerRepository<T> extends IBaseRepository<T> {
  getTopArtistToday(topN: number): Promise<number[]>;
}
