import { Orchestra } from '@/models/orchestra.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IOrchestraRepository } from '@/repository/interface/i.orchestra.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class OrchestraRepository extends BaseRepository<Orchestra> implements IOrchestraRepository<Orchestra> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Orchestra));
  }
}
