import { Artist } from '@/models/artist.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IArtistRepository } from '@/repository/interface/i.artist.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource, In, IsNull } from 'typeorm';

export class ArtistRepository extends BaseRepository<Artist> implements IArtistRepository<Artist> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Artist));
  }

    async findManyByIds(artistsOfTheDayIds: number[]): Promise<Artist[]> {
    return await this.ormRepository.find({
      where: {
        id: In(artistsOfTheDayIds),
        deleteAt: IsNull()
      }
    });
  }

  async getRandomArtist(): Promise<Artist> {
    return await this.ormRepository.createQueryBuilder('artist').orderBy('RANDOM()').limit(1).getOneOrFail();
  }

  async decreaseFollowerCount(artistId: number): Promise<void> {
    await this.ormRepository.decrement({ id: artistId }, 'followers', 1);
  }

  async increaseFollowerCount(artistId: number): Promise<void> {
    await this.ormRepository.increment({ id: artistId }, 'followers', 1);
  }
}
