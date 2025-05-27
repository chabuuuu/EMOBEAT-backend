import { ArtistStudent } from '@/models/artist_student.model';
import { IArtistStudentRepository } from '@/repository/interface/i.artist_student.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IArtistStudentService } from '@/service/interface/i.artist_student.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ArtistStudentService
  extends BaseCrudService<ArtistStudent>
  implements IArtistStudentService<ArtistStudent>
{
  private artistStudentRepository: IArtistStudentRepository<ArtistStudent>;

  constructor(@inject('ArtistStudentRepository') artistStudentRepository: IArtistStudentRepository<ArtistStudent>) {
    super(artistStudentRepository);
    this.artistStudentRepository = artistStudentRepository;
  }
}
