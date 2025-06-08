import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { EmotionCollect } from '@/models/emotion_collect.model';
import { IEmotionCollectService } from '@/service/interface/i.emotion_collect.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class EmotionCollectController {
  public common: IBaseCrudController<EmotionCollect>;
  private emotionCollectService: IEmotionCollectService<EmotionCollect>;
  constructor(
    @inject('EmotionCollectService') emotionCollectService: IEmotionCollectService<EmotionCollect>,
    @inject(ITYPES.Controller) common: IBaseCrudController<EmotionCollect>
  ) {
    this.emotionCollectService = emotionCollectService;
    this.common = common;
  }

  /**
   * * POST /emotion-collect/collect
   */
  async collect(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const emotionCollect = req.body;
      this.emotionCollectService.collect(emotionCollect);
      res.send_ok('Emotion collect successfully');
    } catch (error) {
      next(error);
    }
  }
}
