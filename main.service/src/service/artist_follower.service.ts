import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search/search-data.dto';
import { Artist } from '@/models/artist.model';
import { ArtistFollower } from '@/models/artist_follower.model';
import { IArtistRepository } from '@/repository/interface/i.artist.repository';
import { IArtistFollowerRepository } from '@/repository/interface/i.artist_follower.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IArtistFollowerService } from '@/service/interface/i.artist_follower.service';
import { SearchUtil } from '@/utils/search/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class ArtistFollowerService
  extends BaseCrudService<ArtistFollower>
  implements IArtistFollowerService<ArtistFollower>
{
  private artistFollowerRepository: IArtistFollowerRepository<ArtistFollower>;
  private artistRepository: IArtistRepository<Artist>;

  constructor(
    @inject('ArtistFollowerRepository') artistFollowerRepository: IArtistFollowerRepository<ArtistFollower>,
    @inject('ArtistRepository') artistRepository: IArtistRepository<Artist>
  ) {
    super(artistFollowerRepository);
    this.artistFollowerRepository = artistFollowerRepository;
    this.artistRepository = artistRepository;
  }

  async followArtist(artistId: number, listenerId: number): Promise<void> {
    await this.artistFollowerRepository.create({ data: { artistId, listenerId } });

    // Update the artist's follower count
    this.artistRepository.increaseFollowerCount(artistId);
  }

  async unFollowArtist(artistId: number, listenerId: number): Promise<void> {
    await this.artistFollowerRepository.findOneAndDelete({
      filter: {
        artistId: artistId,
        listenerId: listenerId
      }
    });

    // Update the artist's follower count
    this.artistRepository.decreaseFollowerCount(artistId);
  }

  async myFollowedArtists(listenerId: number, searchData: SearchDataDto): Promise<PagingResponseDto<ArtistFollower>> {
    const { order, paging } = SearchUtil.getWhereCondition(searchData);

    const followedArtist = await this.artistFollowerRepository.findMany({
      filter: {
        listenerId: listenerId
      },
      order: order,
      paging: paging,
      relations: ['artist']
    });

    const total = await this.artistFollowerRepository.count({
      filter: {
        listenerId: listenerId
      }
    });

    return new PagingResponseDto(total, followedArtist);
  }
}
