import { TrackingController } from '@/controller/tracking.controller';
import { ITrackingService } from '@/service/interface/i.tracking.service';
import { TrackingService } from '@/service/tracking.service';

import { Container } from 'inversify';

class TrackingContainer {
  private container = new Container();
  constructor() {
    this.container.bind<ITrackingService>('TrackingService').to(TrackingService);
    this.container.bind<TrackingController>(TrackingController).toSelf();
  }

  export() {
    const trackingController = this.container.get<TrackingController>(TrackingController);
    const trackingService = this.container.get<ITrackingService>('TrackingService');

    return { trackingController, trackingService };
  }
}

const trackingContainer = new TrackingContainer();
const { trackingController, trackingService } = trackingContainer.export();
export { trackingController, trackingService };
