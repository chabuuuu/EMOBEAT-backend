import { ITrackingService } from '@/service/interface/i.tracking.service';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class TrackingController {
  private trackingService: ITrackingService;
  constructor(@inject('TrackingService') trackingService: ITrackingService) {
    this.trackingService = trackingService;
  }
}
