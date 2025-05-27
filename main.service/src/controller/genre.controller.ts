import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { Genre } from '@/models/genre.model';
import { IGenreService } from '@/service/interface/i.genre.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class GenreController {
  public common: IBaseCrudController<Genre>;
  private genreService: IGenreService<Genre>;
  constructor(
    @inject('GenreService') genreService: IGenreService<Genre>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Genre>
  ) {
    this.genreService = genreService;
    this.common = common;
  }
}
