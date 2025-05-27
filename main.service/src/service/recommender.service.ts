import { ErasAndStylesRes } from '@/dto/recommender/response/eras-and-styles.res';
import { InstrumentSpotlightRes } from '@/dto/recommender/response/instrument-spotlight.res';
import { Album } from '@/models/album.model';
import { Artist } from '@/models/artist.model';
import { ArtistFollower } from '@/models/artist_follower.model';
import { Instrument } from '@/models/instrument.model';
import { Music } from '@/models/music.model';
import { Period } from '@/models/period.model';
import { IAlbumRepository } from '@/repository/interface/i.album.repository';
import { IArtistRepository } from '@/repository/interface/i.artist.repository';
import { IArtistFollowerRepository } from '@/repository/interface/i.artist_follower.repository';
import { IInstrumentRepository } from '@/repository/interface/i.instrument.repository';
import { IMusicRepository } from '@/repository/interface/i.music.repository';
import { IPeriodRepository } from '@/repository/interface/i.period.repository';
import { IRecommenderService } from '@/service/interface/i.recommender.service';
import { inject, injectable } from 'inversify';

@injectable()
export class RecommenderService implements IRecommenderService {
  private musicRepository: IMusicRepository<Music>;
  private albumRepository: IAlbumRepository<Album>;
  private artistFollowerRepository: IArtistFollowerRepository<ArtistFollower>;
  private instrumentRepository: IInstrumentRepository<Instrument>;
  private periodRepository: IPeriodRepository<Period>;
  private artistRepository: IArtistRepository<Artist>;

  constructor(
    @inject('MusicRepository') musicRepository: IMusicRepository<Music>,
    @inject('AlbumRepository') albumRepository: IAlbumRepository<Album>,
    @inject('ArtistFollowerRepository') artistFollowerRepository: IArtistFollowerRepository<ArtistFollower>,
    @inject('InstrumentRepository') instrumentRepository: IInstrumentRepository<Instrument>,
    @inject('PeriodRepository') periodRepository: IPeriodRepository<Period>,
    @inject('ArtistRepository') artistRepository: IArtistRepository<Artist>
  ) {
    this.musicRepository = musicRepository;
    this.albumRepository = albumRepository;
    this.artistFollowerRepository = artistFollowerRepository;
    this.instrumentRepository = instrumentRepository;
    this.periodRepository = periodRepository;
    this.artistRepository = artistRepository;
  }

  async getRandomArtist(): Promise<Artist> {
    return await this.artistRepository.getRandomArtist();
  }

  async getRecommendedSongsExclude(listenerId: number, topN: number, excludeMusicIds: number[]): Promise<Music[]> {
    return await this.musicRepository.getPopularSongsExclude(topN, excludeMusicIds);
  }

  async getRecommendedSongs(listenerId: number, topN: number): Promise<Music[]> {
    // Get the most popular songs
    const popularSongs = await this.getPopularSongs(topN);

    return popularSongs;
  }

  async getPopularSongs(topN: number): Promise<Music[]> {
    return await this.musicRepository.findMany({
      order: [
        {
          column: 'favoriteCount',
          direction: 'DESC'
        },
        {
          column: 'listenCount',
          direction: 'DESC'
        }
      ],
      paging: {
        page: 1,
        rpp: topN
      }
    });
  }

  async getPopularAlbums(listenerId: number, topN: number): Promise<Album[]> {
    // Get the most popular albums
    return await this.albumRepository.findMany({
      order: [
        {
          column: 'likeCount',
          direction: 'DESC'
        },
        {
          column: 'viewCount',
          direction: 'DESC'
        }
      ],
      paging: {
        page: 1,
        rpp: topN
      }
    });
  }

  async getTopArtistToday(topN: number): Promise<Artist[]> {
    // Get the most popular artists today
    let artistsOfTheDay = await this.artistFollowerRepository.getTopArtistToday(topN);

    // If there are not enough artists, fill the rest with the most popular artists
    if (artistsOfTheDay.length < topN) {
      const allArtists = await this.artistRepository.findMany({
        order: [
          {
            column: 'viewCount',
            direction: 'DESC'
          }
        ]
      });
      const randomArtists = allArtists.filter((artist) => !artistsOfTheDay.includes(artist));
      artistsOfTheDay = [...artistsOfTheDay, ...randomArtists.slice(0, topN - artistsOfTheDay.length)];
    }

    return artistsOfTheDay;
  }

  async getInstrumentSpotlight(topN: number): Promise<InstrumentSpotlightRes[]> {
    return await this.instrumentRepository.getInstrumentSpotlight(topN);
  }

  async getErasAndStyles(listenerId: number, topN: number): Promise<ErasAndStylesRes[]> {
    return await this.periodRepository.getErasAndStyles(topN);
  }
}
