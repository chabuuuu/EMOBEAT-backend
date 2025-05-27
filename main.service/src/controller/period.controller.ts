import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { Period } from '@/models/period.model';
import { IPeriodService } from '@/service/interface/i.period.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class PeriodController {
  public common: IBaseCrudController<Period>;
  private periodService: IPeriodService<Period>;
  constructor(
    @inject('PeriodService') periodService: IPeriodService<Period>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Period>
  ) {
    this.periodService = periodService;
    this.common = common;
  }
}
