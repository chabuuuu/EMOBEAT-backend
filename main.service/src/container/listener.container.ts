import { ListenerController } from '@/controller/listener.controller';
import { ListenerService } from '@/service/listener.service';
import { Listener } from '@/models/listener.model';
import { ListenerRepository } from '@/repository/listener.repository';
import { IListenerService } from '@/service/interface/i.listener.service';
import { IListenerRepository } from '@/repository/interface/i.listener.repository';
import { BaseContainer } from '@/container/base.container';

class ListenerContainer extends BaseContainer {
  constructor() {
    super(Listener);
    this.container.bind<IListenerService<Listener>>('ListenerService').to(ListenerService);
    this.container.bind<IListenerRepository<Listener>>('ListenerRepository').to(ListenerRepository);
    this.container.bind<ListenerController>(ListenerController).toSelf();
  }

  export() {
    const listenerController = this.container.get<ListenerController>(ListenerController);
    const listenerService = this.container.get<IListenerService<any>>('ListenerService');
    const listenerRepository = this.container.get<IListenerRepository<any>>('ListenerRepository');

    return { listenerController, listenerService, listenerRepository };
  }
}

const listenerContainer = new ListenerContainer();
const { listenerController, listenerService, listenerRepository } = listenerContainer.export();
export { listenerController, listenerService, listenerRepository };
