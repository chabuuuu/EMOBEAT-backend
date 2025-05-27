import { OrchestraController } from '@/controller/orchestra.controller';
import { OrchestraService } from '@/service/orchestra.service';
import { Orchestra } from '@/models/orchestra.model';
import { OrchestraRepository } from '@/repository/orchestra.repository';
import { IOrchestraService } from '@/service/interface/i.orchestra.service';
import { IOrchestraRepository } from '@/repository/interface/i.orchestra.repository';
import { BaseContainer } from '@/container/base.container';

class OrchestraContainer extends BaseContainer {
  constructor() {
    super(Orchestra);
    this.container.bind<IOrchestraService<Orchestra>>('OrchestraService').to(OrchestraService);
    this.container.bind<IOrchestraRepository<Orchestra>>('OrchestraRepository').to(OrchestraRepository);
    this.container.bind<OrchestraController>(OrchestraController).toSelf();
  }

  export() {
    const orchestraController = this.container.get<OrchestraController>(OrchestraController);
    const orchestraService = this.container.get<IOrchestraService<any>>('OrchestraService');
    const orchestraRepository = this.container.get<IOrchestraRepository<any>>('OrchestraRepository');

    return { orchestraController, orchestraService, orchestraRepository };
  }
}

const orchestraContainer = new OrchestraContainer();
const { orchestraController, orchestraService, orchestraRepository } = orchestraContainer.export();
export { orchestraController, orchestraService, orchestraRepository };
