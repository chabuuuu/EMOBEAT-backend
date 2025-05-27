import { MusicController } from '@/controller/music.controller';
import { MusicService } from '@/service/music.service';
import { Music } from '@/models/music.model';
import { MusicRepository } from '@/repository/music.repository';
import { IMusicService } from '@/service/interface/i.music.service';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { BaseContainer } from '@/container/base.container';
import { IGenreRepository } from '@/repository/interface/i.genre.repository';
import { genreRepository } from '@/container/genre.container';
import { IAlbumRepository } from '@/repository/interface/i.album.repository';
import { albumRepository } from '@/container/album.container';
import { IArtistRepository } from '@/repository/interface/i.artist.repository';
import { IInstrumentRepository } from '@/repository/interface/i.instrument.repository';
import { instrumentRepository } from '@/container/instrument.container';
import { IPeriodRepository } from '@/repository/interface/i.period.repository';
import { periodRepository } from '@/container/period.container';
import { ICategoryRepository } from '@/repository/interface/i.category.repository';
import { categoryRepository } from '@/container/category.container';
import { artistRepository } from '@/container/artist.container';
import { ArtistRepository } from '@/repository/artist.repository';
import { AppDataSourceSingleton } from '@/database/db.datasource';

class MusicContainer extends BaseContainer {
  constructor() {
    super(Music);
    this.container.bind<IMusicService<Music>>('MusicService').to(MusicService);
    this.container.bind<IMusicRepository<Music>>('MusicRepository').to(MusicRepository);
    this.container.bind<MusicController>(MusicController).toSelf();

    //Import
    this.container.bind<IGenreRepository<any>>('GenreRepository').toConstantValue(genreRepository);
    this.container.bind<IAlbumRepository<any>>('AlbumRepository').toConstantValue(albumRepository);
    this.container.bind<IInstrumentRepository<any>>('InstrumentRepository').toConstantValue(instrumentRepository);
    this.container.bind<IPeriodRepository<any>>('PeriodRepository').toConstantValue(periodRepository);
    this.container.bind<ICategoryRepository<any>>('CategoryRepository').toConstantValue(categoryRepository);

    // Avoid circular dependency
    this.container
      .bind<IArtistRepository<any>>('ArtistRepository')
      .toConstantValue(new ArtistRepository(AppDataSourceSingleton.getInstance()));
  }

  export() {
    const musicController = this.container.get<MusicController>(MusicController);
    const musicService = this.container.get<IMusicService<any>>('MusicService');
    const musicRepository = this.container.get<IMusicRepository<any>>('MusicRepository');

    return { musicController, musicService, musicRepository };
  }
}

const musicContainer = new MusicContainer();
const { musicController, musicService, musicRepository } = musicContainer.export();
export { musicController, musicService, musicRepository };
