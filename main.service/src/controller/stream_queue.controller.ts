import { IStreamQueueService } from '@/service/interface/i.stream_queue.service';
import { ITYPES } from '@/types/interface.types';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class StreamQueueController {
  private streamQueueService: IStreamQueueService;
  constructor(@inject('StreamQueueService') streamQueueService: IStreamQueueService) {
    this.streamQueueService = streamQueueService;
  }

  /**
   * * POST /stream-queue/add/:musicId
   */
  async addToQueue(req: Request, res: Response, next: NextFunction) {
    const { musicId } = req.params;
    const listener = await getCurrentLoggedUser(req);

    try {
      const result = await this.streamQueueService.addToQueue(listener.id, Number(musicId));
      res.send_ok('Add to queue successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /stream-queue/next/:musicId
   */
  async nextTrack(req: Request, res: Response, next: NextFunction) {
    const { musicId } = req.params;
    const listener = await getCurrentLoggedUser(req);

    try {
      const result = await this.streamQueueService.nextTrack(listener.id, Number(musicId));
      res.send_ok('Next track successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /stream-queue/prev/:musicId
   */
  async prevTrack(req: Request, res: Response, next: NextFunction) {
    const { musicId } = req.params;
    const listener = await getCurrentLoggedUser(req);

    try {
      const result = await this.streamQueueService.prevTrack(listener.id, Number(musicId));
      res.send_ok('Previous track successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * GET /stream-queue/
   */
  async getQueue(req: Request, res: Response, next: NextFunction) {
    const listener = await getCurrentLoggedUser(req);

    try {
      const result = await this.streamQueueService.getQueue(listener.id);
      res.send_ok('Get queue successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
