import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { ListenerMusicRecommendScore } from '@/models/listener_music_recommend_score.model';
import { IListenerMusicRecommendScoreService } from '@/service/interface/i.listener_music_recommend_score.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ListenerMusicRecommendScoreController {
public common: IBaseCrudController<ListenerMusicRecommendScore>;
private listenerMusicRecommendScoreService: IListenerMusicRecommendScoreService<ListenerMusicRecommendScore>;
constructor(
@inject('ListenerMusicRecommendScoreService') listenerMusicRecommendScoreService: IListenerMusicRecommendScoreService<ListenerMusicRecommendScore>,
@inject(ITYPES.Controller) common: IBaseCrudController<ListenerMusicRecommendScore>
) {
this.listenerMusicRecommendScoreService = listenerMusicRecommendScoreService;
this.common = common;
}
}