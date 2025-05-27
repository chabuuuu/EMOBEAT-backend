import { ListenerAlbumLikeController } from '@/controller/listener_album_like.controller';
import { ListenerAlbumLikeService } from '@/service/listener_album_like.service';
import { ListenerAlbumLike } from '@/models/listener_album_like.model';
import { ListenerAlbumLikeRepository } from '@/repository/listener_album_like.repository';
import { IListenerAlbumLikeService } from '@/service/interface/i.listener_album_like.service';
import { IListenerAlbumLikeRepository } from '@/repository/interface/i.listener_album_like.repository';
import { BaseContainer } from '@/container/base.container';
import { IAlbumRepository } from '@/repository/interface/i.album.repository';
import { albumRepository } from '@/container/album.container';

class ListenerAlbumLikeContainer extends BaseContainer {
  constructor() {
    super(ListenerAlbumLike);
    this.container
      .bind<IListenerAlbumLikeService<ListenerAlbumLike>>('ListenerAlbumLikeService')
      .to(ListenerAlbumLikeService);
    this.container
      .bind<IListenerAlbumLikeRepository<ListenerAlbumLike>>('ListenerAlbumLikeRepository')
      .to(ListenerAlbumLikeRepository);
    this.container.bind<ListenerAlbumLikeController>(ListenerAlbumLikeController).toSelf();

    // Import
    this.container.bind<IAlbumRepository<any>>('AlbumRepository').toConstantValue(albumRepository);
  }

  export() {
    const listenerAlbumLikeController = this.container.get<ListenerAlbumLikeController>(ListenerAlbumLikeController);
    const listenerAlbumLikeService = this.container.get<IListenerAlbumLikeService<any>>('ListenerAlbumLikeService');
    const listenerAlbumLikeRepository =
      this.container.get<IListenerAlbumLikeRepository<any>>('ListenerAlbumLikeRepository');

    return { listenerAlbumLikeController, listenerAlbumLikeService, listenerAlbumLikeRepository };
  }
}

const listenerAlbumLikeContainer = new ListenerAlbumLikeContainer();
const { listenerAlbumLikeController, listenerAlbumLikeService, listenerAlbumLikeRepository } =
  listenerAlbumLikeContainer.export();
export { listenerAlbumLikeController, listenerAlbumLikeService, listenerAlbumLikeRepository };
