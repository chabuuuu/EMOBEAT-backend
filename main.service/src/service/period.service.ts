import { Period } from '@/models/period.model';
import { IPeriodRepository } from '@/repository/interface/i.period.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IPeriodService } from '@/service/interface/i.period.service';
import { inject, injectable } from 'inversify';

@injectable()
export class PeriodService extends BaseCrudService<Period> implements IPeriodService<Period> {
  private periodRepository: IPeriodRepository<Period>;

  constructor(@inject('PeriodRepository') periodRepository: IPeriodRepository<Period>) {
    super(periodRepository);
    this.periodRepository = periodRepository;
  }
}
