import { Album } from '@/models/album.model';
import { EntitySubscriberInterface, EventSubscriber, LoadEvent } from 'typeorm';

@EventSubscriber()
export class AlbumSubscriber implements EntitySubscriberInterface<Album> {
  /**
   * Chỉ định entity mà subscriber này áp dụng
   */
  listenTo() {
    return Album;
  }

  /**
   * Tăng listenCount mỗi khi một bản ghi Music được load
   */
  async afterLoad(entity: Album, event?: LoadEvent<Album>): Promise<void> {
    const albumRepository = event?.manager.getRepository(Album);

    if (albumRepository) {
      albumRepository.increment({ id: entity.id }, 'viewCount', 1);
    }
  }
}
