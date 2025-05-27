import { ArtistFollowerController } from '@/controller/artist_follower.controller';
import { ArtistFollowerService } from '@/service/artist_follower.service';
import { ArtistFollower } from '@/models/artist_follower.model';
import { ArtistFollowerRepository } from '@/repository/artist_follower.repository';
import { IArtistFollowerService } from '@/service/interface/i.artist_follower.service';
import { IArtistFollowerRepository } from '@/repository/interface/i.artist_follower.repository';
import { BaseContainer } from '@/container/base.container';
import { IArtistRepository } from '@/repository/interface/i.artist.repository';
import { artistRepository } from '@/container/artist.container';

class ArtistFollowerContainer extends BaseContainer {
  constructor() {
    super(ArtistFollower);
    this.container.bind<IArtistFollowerService<ArtistFollower>>('ArtistFollowerService').to(ArtistFollowerService);
    this.container
      .bind<IArtistFollowerRepository<ArtistFollower>>('ArtistFollowerRepository')
      .to(ArtistFollowerRepository);
    this.container.bind<ArtistFollowerController>(ArtistFollowerController).toSelf();

    // Import
    this.container.bind<IArtistRepository<any>>('ArtistRepository').toConstantValue(artistRepository);
  }

  export() {
    const artistFollowerController = this.container.get<ArtistFollowerController>(ArtistFollowerController);
    const artistFollowerService = this.container.get<IArtistFollowerService<any>>('ArtistFollowerService');
    const artistFollowerRepository = this.container.get<IArtistFollowerRepository<any>>('ArtistFollowerRepository');

    return { artistFollowerController, artistFollowerService, artistFollowerRepository };
  }
}

const artistFollowerContainer = new ArtistFollowerContainer();
const { artistFollowerController, artistFollowerService, artistFollowerRepository } = artistFollowerContainer.export();
export { artistFollowerController, artistFollowerService, artistFollowerRepository };
