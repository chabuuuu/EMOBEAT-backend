import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { Orchestra } from '@/models/orchestra.model';
import { IOrchestraService } from '@/service/interface/i.orchestra.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class OrchestraController {
  public common: IBaseCrudController<Orchestra>;
  private orchestraService: IOrchestraService<Orchestra>;
  constructor(
    @inject('OrchestraService') orchestraService: IOrchestraService<Orchestra>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Orchestra>
  ) {
    this.orchestraService = orchestraService;
    this.common = common;
  }
}
