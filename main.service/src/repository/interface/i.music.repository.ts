import { Music } from '@/models/music.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IMusicRepository<T> extends IBaseRepository<T> {
  increaseListenCount(musicId: number): Promise<void>;
  getSongsByEmotions(musicEmotions: number[], topN: number): Promise<Music[]>;
  getPopularSongsExclude(topN: number, excludeMusicIds: number[]): Promise<Music[]>;
  decreaseFavoriteCount(musicId: number): Promise<void>;
  increaseFavoriteCount(musicId: number): Promise<void>;
  findApprovedMusicsByArtistId(artistId: number): Promise<Music[]>;
  findApprovedMusicsComposedByArtistId(artistId: number): Promise<Music[]>;
  findMusicToAddToQueue(musicId: number): Promise<Music | null>;
  findManyByIds(musicIds: number[]): Promise<T[]>;
}
