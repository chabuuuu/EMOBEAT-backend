import { Instrument } from '@/models/instrument.model';
import { IInstrumentRepository } from '@/repository/interface/i.instrument.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IInstrumentService } from '@/service/interface/i.instrument.service';
import { inject, injectable } from 'inversify';

@injectable()
export class InstrumentService extends BaseCrudService<Instrument> implements IInstrumentService<Instrument> {
  private instrumentRepository: IInstrumentRepository<Instrument>;

  constructor(@inject('InstrumentRepository') instrumentRepository: IInstrumentRepository<Instrument>) {
    super(instrumentRepository);
    this.instrumentRepository = instrumentRepository;
  }
}
