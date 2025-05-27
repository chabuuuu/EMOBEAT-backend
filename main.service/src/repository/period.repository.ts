import { ErasAndStylesRes } from '@/dto/recommender/response/eras-and-styles.res';
import { Music } from '@/models/music.model';
import { Period } from '@/models/period.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IPeriodRepository } from '@/repository/interface/i.period.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class PeriodRepository extends BaseRepository<Period> implements IPeriodRepository<Period> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Period));
  }

  async getErasAndStyles(topN: number): Promise<ErasAndStylesRes[]> {
    // Subquery lấy topN period.id theo số lượng music
    const subQuery = this.ormRepository
      .createQueryBuilder('period')
      .leftJoin('period.musics', 'music')
      .select('period.id')
      .groupBy('period.id')
      .orderBy('COUNT(music.id)', 'DESC')
      .limit(topN);

    // Lấy đầy đủ thông tin period và musics
    const periods = await this.ormRepository
      .createQueryBuilder('period')
      .leftJoinAndSelect('period.musics', 'music')
      .where(`period.id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .getMany();

    return periods.map((period) => ({
      period: {
        id: period.id,
        name: period.name,
        picture: period.picture,
        musics: period.musics as Music[]
      }
    }));
  }
}
