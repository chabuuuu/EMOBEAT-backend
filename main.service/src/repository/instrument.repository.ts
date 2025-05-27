import { InstrumentSpotlightRes } from '@/dto/recommender/response/instrument-spotlight.res';
import { Instrument } from '@/models/instrument.model';
import { Music } from '@/models/music.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IInstrumentRepository } from '@/repository/interface/i.instrument.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class InstrumentRepository extends BaseRepository<Instrument> implements IInstrumentRepository<Instrument> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Instrument));
  }

  async getInstrumentSpotlight(topN: number): Promise<InstrumentSpotlightRes[]> {
    // Subquery chỉ lấy id instrument theo số lượng music nhiều nhất
    const subQuery = this.ormRepository
      .createQueryBuilder('instrument')
      .leftJoin('instrument.musics', 'music')
      .select('instrument.id')
      .groupBy('instrument.id')
      .orderBy('COUNT(music.id)', 'DESC')
      .limit(topN);

    // Lấy đầy đủ thông tin instrument và musics
    const instruments = await this.ormRepository
      .createQueryBuilder('instrument')
      .leftJoinAndSelect('instrument.musics', 'music')
      .where(`instrument.id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .getMany();

    // Chỉ lấy 3 bài music đầu tiên của mỗi instrument
    return instruments.map((instrument) => ({
      instrument: {
        id: instrument.id,
        name: instrument.name,
        picture: instrument.picture,
        musics: (instrument.musics as Music[]).slice(0, 3)
      }
    }));
  }
}
