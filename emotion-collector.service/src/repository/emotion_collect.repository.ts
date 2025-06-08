import { EmotionCollect } from '@/models/emotion_collect.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IEmotionCollectRepository } from '@/repository/interface/i.emotion_collect.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class EmotionCollectRepository extends BaseRepository<EmotionCollect> implements IEmotionCollectRepository<EmotionCollect> {
constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
super(dataSource.getRepository(EmotionCollect));
}
}