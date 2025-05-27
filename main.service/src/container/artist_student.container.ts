import { ArtistStudentController } from '@/controller/artist_student.controller';
import { ArtistStudentService } from '@/service/artist_student.service';
import { ArtistStudent } from '@/models/artist_student.model';
import { ArtistStudentRepository } from '@/repository/artist_student.repository';
import { IArtistStudentService } from '@/service/interface/i.artist_student.service';
import { IArtistStudentRepository } from '@/repository/interface/i.artist_student.repository';
import { BaseContainer } from '@/container/base.container';

class ArtistStudentContainer extends BaseContainer {
  constructor() {
    super(ArtistStudent);
this.container.bind<IArtistStudentService<ArtistStudent>>('ArtistStudentService').to(ArtistStudentService);
this.container.bind<IArtistStudentRepository<ArtistStudent>>('ArtistStudentRepository').to(ArtistStudentRepository);
this.container.bind<ArtistStudentController>(ArtistStudentController).toSelf();
}

export() {
    const artistStudentController = this.container.get<ArtistStudentController>(ArtistStudentController);
    const artistStudentService = this.container.get<IArtistStudentService<any>>('ArtistStudentService');
    const artistStudentRepository = this.container.get<IArtistStudentRepository<any>>('ArtistStudentRepository');

return { artistStudentController, artistStudentService, artistStudentRepository };
}
}

const artistStudentContainer = new ArtistStudentContainer();
const { artistStudentController, artistStudentService,artistStudentRepository } = artistStudentContainer.export();
export { artistStudentController, artistStudentService, artistStudentRepository };