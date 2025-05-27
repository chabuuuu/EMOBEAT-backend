import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IArtistStudentRepository<T> extends IBaseRepository<T> {
  hardDeleteByTeacherId(teacherId: number): Promise<void>;
}
