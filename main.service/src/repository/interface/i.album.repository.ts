import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IAlbumRepository<T> extends IBaseRepository<T> {
  increaseLikeCount(albumId: number): Promise<void>;
  decreaseLikeCount(albumId: number): Promise<void>;
}
