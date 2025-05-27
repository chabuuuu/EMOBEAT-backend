import { Music } from '@/models/music.model';
import { stringNormalize } from '@/utils/string-normalize.util';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class MusicSubscriber implements EntitySubscriberInterface<Music> {
  listenTo() {
    return Music;
  }

  beforeInsert(event: InsertEvent<Music>) {
    this.setSlug(event.entity);
  }

  beforeUpdate(event: UpdateEvent<Music>) {
    if (event.entity) {
      this.setSlug(event.entity as Music);
    }
  }

  private setSlug(music: Music) {
    const slugify = (str: string) => (str ? stringNormalize(str) : '');
    music.slug = slugify([music.name, music.description].filter(Boolean).join(''));
  }
}
