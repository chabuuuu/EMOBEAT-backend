import { Artist } from '@/models/artist.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IArtistRepository<T> extends IBaseRepository<T> {
  getRandomArtist(): Promise<Artist>;
  decreaseFollowerCount(artistId: number): Promise<void>;
  increaseFollowerCount(artistId: number): Promise<void>;
    findManyByIds(artistsOfTheDayIds: number[]): Promise<Artist[]>;
}
