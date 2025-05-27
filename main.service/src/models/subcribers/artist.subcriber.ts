import { Artist } from '@/models/artist.model';
import { EntitySubscriberInterface, EventSubscriber, LoadEvent } from 'typeorm';

@EventSubscriber()
export class ArtistSubscriber implements EntitySubscriberInterface<Artist> {
  /**
   * Chỉ định entity mà subscriber này áp dụng
   */
  listenTo() {
    return Artist;
  }

  /**
   * Tăng listenCount mỗi khi một bản ghi Music được load
   */
  async afterLoad(entity: Artist, event?: LoadEvent<Artist>): Promise<void> {
    const artistRepository = event?.manager.getRepository(Artist);
    if (artistRepository) {
      artistRepository.increment({ id: entity.id }, 'viewCount', 1);
    }
  }
}
