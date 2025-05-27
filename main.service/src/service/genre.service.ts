import { Genre } from '@/models/genre.model';
import { IGenreRepository } from '@/repository/interface/i.genre.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IGenreService } from '@/service/interface/i.genre.service';
import { inject, injectable } from 'inversify';

@injectable()
export class GenreService extends BaseCrudService<Genre> implements IGenreService<Genre> {
  private genreRepository: IGenreRepository<Genre>;

  constructor(@inject('GenreRepository') genreRepository: IGenreRepository<Genre>) {
    super(genreRepository);
    this.genreRepository = genreRepository;
  }
}
