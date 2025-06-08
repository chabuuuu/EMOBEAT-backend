import { Music } from '@/models/music.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IMusicRepository<T> extends IBaseRepository<T> {
  getPopularSongsExclude(topN: number, excludeMusicIds: number[]): Promise<Music[]>;
  decreaseFavoriteCount(musicId: number): Promise<void>;
  increaseFavoriteCount(musicId: number): Promise<void>;
  findApprovedMusicsByArtistId(artistId: number): Promise<Music[]>;
  findApprovedMusicsComposedByArtistId(artistId: number): Promise<Music[]>;
  findMusicToAddToQueue(musicId: number): Promise<Music | null>;
    findManyByIds(musicIds: number[]): Promise<T[]>;

}
