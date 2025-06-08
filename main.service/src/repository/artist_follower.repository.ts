import { Artist } from '@/models/artist.model';
import { ArtistFollower } from '@/models/artist_follower.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IArtistFollowerRepository } from '@/repository/interface/i.artist_follower.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ArtistFollowerRepository
  extends BaseRepository<ArtistFollower>
  implements IArtistFollowerRepository<ArtistFollower>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(ArtistFollower));
  }

  async getTopArtistToday(topN: number): Promise<number[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const artistFollowerQuery = this.ormRepository
      .createQueryBuilder('artist_followers')
      .innerJoinAndSelect('artist_followers.artist', 'artist')
      .where('artist_followers.createAt >= :today AND artist_followers.createAt < :tomorrow', { today, tomorrow })
      .select('artist_followers.artistId', 'artistId')
      .addSelect('artist.name', 'artistName')
      .addSelect('COUNT(artist_followers.id)', 'followerCount')
      .groupBy('artist_followers.artistId')
      .addGroupBy('artist.name')
      .orderBy('COUNT(artist_followers.id)', 'DESC') // Sửa dòng này
      .limit(topN);

    const artistFollower = await artistFollowerQuery.getRawMany();

    if (artistFollower.length === 0) {
      // If no artist followers found, return an empty array
      return [];
    }

    // Map the result to an array of artist IDs
    return artistFollower.map((item) => item.artistId);
  }
}
