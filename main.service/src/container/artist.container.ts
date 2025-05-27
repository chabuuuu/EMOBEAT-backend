import { ArtistController } from '@/controller/artist.controller';
import { ArtistService } from '@/service/artist.service';
import { Artist } from '@/models/artist.model';
import { ArtistRepository } from '@/repository/artist.repository';
import { IArtistService } from '@/service/interface/i.artist.service';
import { IArtistRepository } from '@/repository/interface/i.artist.repository';
import { BaseContainer } from '@/container/base.container';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { IGenreRepository } from '@/repository/interface/i.genre.repository';
import { genreRepository } from '@/container/genre.container';
import { IOrchestraRepository } from '@/repository/interface/i.orchestra.repository';
import { orchestraRepository } from '@/container/orchestra.container';
import { IPeriodRepository } from '@/repository/interface/i.period.repository';
import { periodRepository } from '@/container/period.container';
import { IInstrumentRepository } from '@/repository/interface/i.instrument.repository';
import { instrumentRepository } from '@/container/instrument.container';
import { IArtistStudentRepository } from '@/repository/interface/i.artist_student.repository';
import { artistStudentRepository } from '@/container/artist_student.container';
import { musicRepository } from '@/container/music.container';

class ArtistContainer extends BaseContainer {
  constructor() {
    super(Artist);
    this.container.bind<IArtistService<Artist>>('ArtistService').to(ArtistService);
    this.container.bind<IArtistRepository<Artist>>('ArtistRepository').to(ArtistRepository);
    this.container.bind<ArtistController>(ArtistController).toSelf();

    // Import
    this.container.bind<IMusicRepository<any>>('MusicRepository').toConstantValue(musicRepository);
    this.container.bind<IGenreRepository<any>>('GenreRepository').toConstantValue(genreRepository);
    this.container.bind<IOrchestraRepository<any>>('OrchestraRepository').toConstantValue(orchestraRepository);
    this.container.bind<IPeriodRepository<any>>('PeriodRepository').toConstantValue(periodRepository);
    this.container.bind<IInstrumentRepository<any>>('InstrumentRepository').toConstantValue(instrumentRepository);
    this.container
      .bind<IArtistStudentRepository<any>>('ArtistStudentRepository')
      .toConstantValue(artistStudentRepository);
  }

  export() {
    const artistController = this.container.get<ArtistController>(ArtistController);
    const artistService = this.container.get<IArtistService<any>>('ArtistService');
    const artistRepository = this.container.get<IArtistRepository<any>>('ArtistRepository');

    return { artistController, artistService, artistRepository };
  }
}

const artistContainer = new ArtistContainer();
const { artistController, artistService, artistRepository } = artistContainer.export();
export { artistController, artistService, artistRepository };
