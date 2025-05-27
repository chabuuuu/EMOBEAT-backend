import { Music } from '@/models/music.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource, IsNull } from 'typeorm';

export class MusicRepository extends BaseRepository<Music> implements IMusicRepository<Music> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Music));
  }

  async findMusicToAddToQueue(musicId: number): Promise<Music | null> {
    return await this.ormRepository.findOne({
      where: {
        id: musicId,
        deleteAt: IsNull()
      },
      relations: {
        artists: true
      },
      select: {
        id: true,
        name: true,
        nationality: true,
        coverPhoto: true,
        resourceLink: true,
        listenCount: true,
        favoriteCount: true,
        artists: {
          id: true,
          picture: true,
          name: true
        }
      }
    });
  }

  async getPopularSongsExclude(topN: number, excludeMusicIds: number[]): Promise<Music[]> {
    const qb = this.ormRepository
      .createQueryBuilder('music')
      .where(excludeMusicIds && excludeMusicIds.length > 0 ? 'music.id NOT IN (:...excludeMusicIds)' : '1=1', {
        excludeMusicIds
      })
      .orderBy('music.favoriteCount', 'DESC')
      .addOrderBy('music.listenCount', 'DESC')
      .limit(topN);

    return qb.getMany();
  }

  async decreaseFavoriteCount(musicId: number): Promise<void> {
    await this.ormRepository.decrement({ id: musicId }, 'favoriteCount', 1);
  }

  async increaseFavoriteCount(musicId: number): Promise<void> {
    await this.ormRepository.increment({ id: musicId }, 'favoriteCount', 1);
  }

  async findApprovedMusicsComposedByArtistId(artistId: number): Promise<Music[]> {
    const musics = await this.ormRepository
      .createQueryBuilder('music')
      .innerJoin('music.composers', 'artist')
      .where('artist.id = :artistId', { artistId })
      .andWhere('music.approved = :approved', { approved: true })
      .select(['music.id', 'music.name', 'music.coverPhoto'])
      .getMany();

    return musics;
  }

  async findApprovedMusicsByArtistId(artistId: number): Promise<Music[]> {
    const musics = await this.ormRepository
      .createQueryBuilder('music')
      .innerJoin('music.artists', 'artist')
      .where('artist.id = :artistId', { artistId })
      .andWhere('music.approved = :approved', { approved: true })
      .select(['music.id', 'music.name', 'music.coverPhoto'])
      .getMany();

    return musics;
  }
}
