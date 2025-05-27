import { FavoriteList } from '@/models/favorite_list.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IFavoriteListRepository } from '@/repository/interface/i.favorite_list.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class FavoriteListRepository
  extends BaseRepository<FavoriteList>
  implements IFavoriteListRepository<FavoriteList>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(FavoriteList));
  }
}
