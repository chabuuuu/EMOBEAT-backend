import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { ArtistStudent } from '@/models/artist_student.model';
import { IArtistStudentService } from '@/service/interface/i.artist_student.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ArtistStudentController {
public common: IBaseCrudController<ArtistStudent>;
private artistStudentService: IArtistStudentService<ArtistStudent>;
constructor(
@inject('ArtistStudentService') artistStudentService: IArtistStudentService<ArtistStudent>,
@inject(ITYPES.Controller) common: IBaseCrudController<ArtistStudent>
) {
this.artistStudentService = artistStudentService;
this.common = common;
}
}