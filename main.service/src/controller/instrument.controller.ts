import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { Instrument } from '@/models/instrument.model';
import { IInstrumentService } from '@/service/interface/i.instrument.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class InstrumentController {
  public common: IBaseCrudController<Instrument>;
  private instrumentService: IInstrumentService<Instrument>;
  constructor(
    @inject('InstrumentService') instrumentService: IInstrumentService<Instrument>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Instrument>
  ) {
    this.instrumentService = instrumentService;
    this.common = common;
  }
}
