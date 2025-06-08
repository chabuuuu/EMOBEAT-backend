import { ErasAndStylesRes } from '@/dto/recommender/response/eras-and-styles.res';
import { InstrumentSpotlightRes } from '@/dto/recommender/response/instrument-spotlight.res';
import { RedisSchemaEnum } from '@/enums/redis-schema.enum';
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
import redis from '@/utils/redis/redis.util';
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

  async getFromRecommdation(listenerId: number, topN: number, excludeMusicIds: number[]): Promise<Music[]> {
    const recommendations = await redis.get(RedisSchemaEnum.emobeat_recommendations + ':' + listenerId);

    if (recommendations === null || recommendations.length === 0) {
      // If there are no recommendations, return an empty array
      return [];
    }

    // If have, parse the recommendations to an array of music IDs
    const musicIds = recommendations.split(',').map((id) => {
      // If the ID is in excludeMusicIds, skip it
      if (excludeMusicIds.includes(Number(id))) {
        return null;
      }
      return Number(id);
    });

    // Filter out null values and get top N music IDs
    const filteredMusicIds = musicIds.filter((id): id is number => id !== null).slice(0, topN);

    if (filteredMusicIds === null || filteredMusicIds.length === 0) {
      // If all recommendations are excluded, return an empty array
      return [];
    }

    // Get the music objects from the music repository
    const musics = await this.musicRepository.findManyByIds(filteredMusicIds);

    if (musics === null || musics.length === 0) {
      // If no music found, return an empty array
      return [];
    }

    // If there are recommendations, return the music objects
    return musics;
  }

  async getRandomArtist(): Promise<Artist> {
    return await this.artistRepository.getRandomArtist();
  }

  async getRecommendedSongsExclude(listenerId: number, topN: number, excludeMusicIds: number[]): Promise<Music[]> {
    // Get recommendations from Redis
    const recommendedSongs = await this.getFromRecommdation(listenerId, topN, excludeMusicIds);

    // If have enough recommendations, return them
    if (recommendedSongs.length >= topN) {
      return recommendedSongs.slice(0, topN);
    }

    // If not enough recommendations, get more popular songs
    const remainingCount = topN - recommendedSongs.length;

    const popularSongs = await this.musicRepository.getPopularSongsExclude(
      remainingCount,
      recommendedSongs.map((song) => song.id)
    );

    // Combine the recommended songs with the popular songs
    recommendedSongs.push(...popularSongs);

    return recommendedSongs;
  }

  async getRecommendedSongs(listenerId: number, topN: number): Promise<Music[]> {
    // Get recommendations from Redis
    const recommendedSongs = await this.getFromRecommdation(listenerId, topN, []);

    // If have enough recommendations, return them
    if (recommendedSongs.length >= topN) {
      return recommendedSongs.slice(0, topN);
    }

    // If do not have recommendation songs, get by current listener's emotion
    const listenerEmotion = await redis.get(RedisSchemaEnum.emobeat_user_emotions + ':' + listenerId);

    // If the listener's emotion is exists, get songs by emotion
    if (listenerEmotion) {
      const emotionSongs = await this.musicRepository.getSongsByEmotion(Number.parseInt(listenerEmotion), topN);
      recommendedSongs.push(...emotionSongs);
    }

    // If not enough recommendations, get more popular songs
    const remainingCount = topN - recommendedSongs.length;

    // Get the most popular songs
    const popularSongs = await this.musicRepository.getPopularSongsExclude(
      remainingCount,
      recommendedSongs.map((song) => song.id)
    );

    // Combine the recommended songs with the popular songs
    recommendedSongs.push(...popularSongs);

    return recommendedSongs;
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
    const artistsOfTheDayIds = await this.artistFollowerRepository.getTopArtistToday(topN);

    let artistsOfTheDay: Artist[] = [];

    if (artistsOfTheDayIds.length > 0) {
      // Fetch the artist details from the repository
      const artists = await this.artistRepository.findManyByIds(artistsOfTheDayIds);

      // Filter out any null values (in case some IDs do not correspond to any artist)
      artistsOfTheDay.push(...artists.filter((artist) => artist !== null));
    }

    console.log(`Top ${topN} artists of the day:`, artistsOfTheDay);

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
