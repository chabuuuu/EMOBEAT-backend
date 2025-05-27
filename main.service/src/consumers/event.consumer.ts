import { MusicConsumer } from '@/consumers/music.consumer';

export class EventConsumer {
  constructor() {
    EventConsumer.init();
  }

  static init() {
    MusicConsumer.init();
    // Add other consumers here

    console.log('Event consumers initialized');
  }
}
