import { Listener } from '@/models/listener.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IListenerRepository } from '@/repository/interface/i.listener.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ListenerRepository extends BaseRepository<Listener> implements IListenerRepository<Listener> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Listener));
  }

  async incrementPoints(listenerId: number, points: number): Promise<void> {
    await this.ormRepository.increment({ id: listenerId }, 'points', points);
  }
}
