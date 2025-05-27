import { AlbumController } from '@/controller/album.controller';
import { AlbumService } from '@/service/album.service';
import { Album } from '@/models/album.model';
import { AlbumRepository } from '@/repository/album.repository';
import { IAlbumService } from '@/service/interface/i.album.service';
import { IAlbumRepository } from '@/repository/interface/i.album.repository';
import { BaseContainer } from '@/container/base.container';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { Admin } from '@/models/admin.model';
import { adminRepository } from '@/container/admin.container';

class AlbumContainer extends BaseContainer {
  constructor() {
    super(Album);
    this.container.bind<IAlbumService<Album>>('AlbumService').to(AlbumService);
    this.container.bind<IAlbumRepository<Album>>('AlbumRepository').to(AlbumRepository);
    this.container.bind<AlbumController>(AlbumController).toSelf();

    // Import
    this.container.bind<IAdminRepository<Admin>>('AdminRepository').toConstantValue(adminRepository);
  }

  export() {
    const albumController = this.container.get<AlbumController>(AlbumController);
    const albumService = this.container.get<IAlbumService<any>>('AlbumService');
    const albumRepository = this.container.get<IAlbumRepository<any>>('AlbumRepository');

    return { albumController, albumService, albumRepository };
  }
}

const albumContainer = new AlbumContainer();
const { albumController, albumService, albumRepository } = albumContainer.export();
export { albumController, albumService, albumRepository };
