import { InstrumentController } from '@/controller/instrument.controller';
import { InstrumentService } from '@/service/instrument.service';
import { Instrument } from '@/models/instrument.model';
import { InstrumentRepository } from '@/repository/instrument.repository';
import { IInstrumentService } from '@/service/interface/i.instrument.service';
import { IInstrumentRepository } from '@/repository/interface/i.instrument.repository';
import { BaseContainer } from '@/container/base.container';

class InstrumentContainer extends BaseContainer {
  constructor() {
    super(Instrument);
    this.container.bind<IInstrumentService<Instrument>>('InstrumentService').to(InstrumentService);
    this.container.bind<IInstrumentRepository<Instrument>>('InstrumentRepository').to(InstrumentRepository);
    this.container.bind<InstrumentController>(InstrumentController).toSelf();
  }

  export() {
    const instrumentController = this.container.get<InstrumentController>(InstrumentController);
    const instrumentService = this.container.get<IInstrumentService<any>>('InstrumentService');
    const instrumentRepository = this.container.get<IInstrumentRepository<any>>('InstrumentRepository');

    return { instrumentController, instrumentService, instrumentRepository };
  }
}

const instrumentContainer = new InstrumentContainer();
const { instrumentController, instrumentService, instrumentRepository } = instrumentContainer.export();
export { instrumentController, instrumentService, instrumentRepository };
