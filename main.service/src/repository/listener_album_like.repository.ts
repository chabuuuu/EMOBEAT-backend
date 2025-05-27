import { ListenerAlbumLike } from '@/models/listener_album_like.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IListenerAlbumLikeRepository } from '@/repository/interface/i.listener_album_like.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ListenerAlbumLikeRepository
  extends BaseRepository<ListenerAlbumLike>
  implements IListenerAlbumLikeRepository<ListenerAlbumLike>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(ListenerAlbumLike));
  }
}
