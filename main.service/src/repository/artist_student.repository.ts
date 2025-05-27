import { ArtistStudent } from '@/models/artist_student.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IArtistStudentRepository } from '@/repository/interface/i.artist_student.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ArtistStudentRepository
  extends BaseRepository<ArtistStudent>
  implements IArtistStudentRepository<ArtistStudent>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(ArtistStudent));
  }

  async hardDeleteByTeacherId(teacherId: number): Promise<void> {
    await this.ormRepository.delete({
      teacherId: teacherId
    });
  }
}
