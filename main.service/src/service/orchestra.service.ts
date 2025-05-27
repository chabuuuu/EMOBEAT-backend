import { Orchestra } from '@/models/orchestra.model';
import { IOrchestraRepository } from '@/repository/interface/i.orchestra.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IOrchestraService } from '@/service/interface/i.orchestra.service';
import { inject, injectable } from 'inversify';

@injectable()
export class OrchestraService extends BaseCrudService<Orchestra> implements IOrchestraService<Orchestra> {
  private orchestraRepository: IOrchestraRepository<Orchestra>;

  constructor(@inject('OrchestraRepository') orchestraRepository: IOrchestraRepository<Orchestra>) {
    super(orchestraRepository);
    this.orchestraRepository = orchestraRepository;
  }
}
