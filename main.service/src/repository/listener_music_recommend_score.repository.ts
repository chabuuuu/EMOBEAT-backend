import { ListenerMusicRecommendScore } from '@/models/listener_music_recommend_score.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IListenerMusicRecommendScoreRepository } from '@/repository/interface/i.listener_music_recommend_score.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ListenerMusicRecommendScoreRepository extends BaseRepository<ListenerMusicRecommendScore> implements IListenerMusicRecommendScoreRepository<ListenerMusicRecommendScore> {
constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
super(dataSource.getRepository(ListenerMusicRecommendScore));
}
}