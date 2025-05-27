import { GenreController } from '@/controller/genre.controller';
import { GenreService } from '@/service/genre.service';
import { Genre } from '@/models/genre.model';
import { GenreRepository } from '@/repository/genre.repository';
import { IGenreService } from '@/service/interface/i.genre.service';
import { IGenreRepository } from '@/repository/interface/i.genre.repository';
import { BaseContainer } from '@/container/base.container';

class GenreContainer extends BaseContainer {
  constructor() {
    super(Genre);
    this.container.bind<IGenreService<Genre>>('GenreService').to(GenreService);
    this.container.bind<IGenreRepository<Genre>>('GenreRepository').to(GenreRepository);
    this.container.bind<GenreController>(GenreController).toSelf();
  }

  export() {
    const genreController = this.container.get<GenreController>(GenreController);
    const genreService = this.container.get<IGenreService<any>>('GenreService');
    const genreRepository = this.container.get<IGenreRepository<any>>('GenreRepository');

    return { genreController, genreService, genreRepository };
  }
}

const genreContainer = new GenreContainer();
const { genreController, genreService, genreRepository } = genreContainer.export();
export { genreController, genreService, genreRepository };
