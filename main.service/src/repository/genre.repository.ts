import { Genre } from '@/models/genre.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IGenreRepository } from '@/repository/interface/i.genre.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class GenreRepository extends BaseRepository<Genre> implements IGenreRepository<Genre> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Genre));
  }
}
