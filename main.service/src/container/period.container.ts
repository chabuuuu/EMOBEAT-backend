import { PeriodController } from '@/controller/period.controller';
import { PeriodService } from '@/service/period.service';
import { Period } from '@/models/period.model';
import { PeriodRepository } from '@/repository/period.repository';
import { IPeriodService } from '@/service/interface/i.period.service';
import { IPeriodRepository } from '@/repository/interface/i.period.repository';
import { BaseContainer } from '@/container/base.container';

class PeriodContainer extends BaseContainer {
  constructor() {
    super(Period);
    this.container.bind<IPeriodService<Period>>('PeriodService').to(PeriodService);
    this.container.bind<IPeriodRepository<Period>>('PeriodRepository').to(PeriodRepository);
    this.container.bind<PeriodController>(PeriodController).toSelf();
  }

  export() {
    const periodController = this.container.get<PeriodController>(PeriodController);
    const periodService = this.container.get<IPeriodService<any>>('PeriodService');
    const periodRepository = this.container.get<IPeriodRepository<any>>('PeriodRepository');

    return { periodController, periodService, periodRepository };
  }
}

const periodContainer = new PeriodContainer();
const { periodController, periodService, periodRepository } = periodContainer.export();
export { periodController, periodService, periodRepository };
