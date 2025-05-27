import { Album } from '@/models/album.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IAlbumRepository } from '@/repository/interface/i.album.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class AlbumRepository extends BaseRepository<Album> implements IAlbumRepository<Album> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Album));
  }

  async increaseLikeCount(albumId: number): Promise<void> {
    await this.ormRepository.increment({ id: albumId }, 'likeCount', 1);
  }

  async decreaseLikeCount(albumId: number): Promise<void> {
    await this.ormRepository.decrement({ id: albumId }, 'likeCount', 1);
  }
}
